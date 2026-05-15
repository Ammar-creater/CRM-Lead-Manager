const Lead = require('../models/Lead');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

class LeadController {
  
  async getAllLeads(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const search = req.query.search || '';
      const status = req.query.status;
      
      
      let query = {};
      
      
      if (req.user.role !== 'admin') {
        query.createdBy = req.userId;
      }
      
    
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ];
      }
      
      
      if (status && status !== 'all') {
        query.status = status;
      }
      
      
      const leads = await Lead.find(query)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Lead.countDocuments(query);
      
      res.status(200).json({
        success: true,
        data: leads,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  
  async createLead(req, res, next) {
    try {
      const { name, email, phone, assignedTo, notes, source } = req.body;
      
      
      let assignedToName = 'Unassigned';
      if (assignedTo) {
        const user = await User.findById(assignedTo);
        if (!user) {
          return next(new AppError('Assigned user not found', 404));
        }
        assignedToName = user.name;
      }
      
      const lead = await Lead.create({
        name,
        email,
        phone,
        assignedTo: assignedTo || null,
        assignedToName,
        notes,
        source,
        createdBy: req.userId
      });
      
      res.status(201).json({
        success: true,
        data: lead
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      
      if (!['new', 'contacted', 'converted'].includes(status)) {
        return next(new AppError('Invalid status', 400));
      }
      
      
      const lead = await Lead.findOne({
        _id: id,
        createdBy: req.userId
      });
      
      if (!lead) {
        return next(new AppError('Lead not found or unauthorized', 404));
      }
      
      lead.status = status;
      if (status === 'contacted' && !lead.lastContacted) {
        lead.lastContacted = Date.now();
      }
      
      await lead.save();
      
      res.status(200).json({
        success: true,
        data: lead
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  
  async deleteLead(req, res, next) {
    try {
      const { id } = req.params;
      
      const lead = await Lead.findOneAndUpdate(
        { _id: id, createdBy: req.userId },
        { isDeleted: true },
        { new: true }
      );
      
      if (!lead) {
        return next(new AppError('Lead not found or unauthorized', 404));
      }
      
      res.status(200).json({
        success: true,
        message: 'Lead deleted successfully'
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  
  async getAnalytics(req, res, next) {
    try {
      let query = {};
      
      
      if (req.user.role !== 'admin') {
        query.createdBy = req.userId;
      }
      
      const [
        totalLeads,
        newLeads,
        contactedLeads,
        convertedLeads,
        leadsByStatus,
        recentLeads
      ] = await Promise.all([
        Lead.countDocuments(query),
        Lead.countDocuments({ ...query, status: 'new' }),
        Lead.countDocuments({ ...query, status: 'contacted' }),
        Lead.countDocuments({ ...query, status: 'converted' }),
        Lead.aggregate([
          { $match: query },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        Lead.find(query)
          .sort({ createdAt: -1 })
          .limit(5)
          .select('name status createdAt')
      ]);
      
      const conversionRate = totalLeads > 0 
        ? ((convertedLeads / totalLeads) * 100).toFixed(2) 
        : 0;
      
      res.status(200).json({
        success: true,
        data: {
          overview: {
            totalLeads,
            newLeads,
            contactedLeads,
            convertedLeads,
            conversionRate
          },
          leadsByStatus,
          recentLeads,
          createdAt: new Date()
        }
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  
  async getUsers(req, res, next) {
    try {
      const users = await User.find({ isActive: true })
        .select('name email role')
        .sort('name');
      
      res.status(200).json({
        success: true,
        data: users
      });
      
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LeadController();