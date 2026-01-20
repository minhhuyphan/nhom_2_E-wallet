const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Notification = require("../models/Notification");

// @desc    Mua vé số
// @route   POST /api/lottery/buy-ticket
// @access  Private
exports.buyTicket = async (req, res) => {
  try {
    const { ticketNumber, walletAddress, transactionHash, amount } = req.body;

    // Validate input
    if (!ticketNumber || !walletAddress || !transactionHash || !amount) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    // Validate ticket number format (6 digits)
    if (!/^\d{6}$/.test(ticketNumber)) {
      return res.status(400).json({
        success: false,
        message: "Số vé phải có đúng 6 chữ số",
      });
    }

    // Check if transaction hash already exists
    const existingTicket = await Ticket.findOne({ transactionHash });
    if (existingTicket) {
      return res.status(400).json({
        success: false,
        message: "Vé này đã được ghi nhận",
      });
    }

    // Create ticket
    const ticket = await Ticket.create({
      user: req.user._id,
      ticketNumber,
      walletAddress: walletAddress.toLowerCase(),
      transactionHash,
      amount,
    });

    // Gửi thông báo mua vé thành công
    try {
      await Notification.createTicketPurchaseNotification(
        req.user._id,
        ticketNumber,
        amount,
        ticket._id,
      );
    } catch (notifError) {
      // Log lỗi nhưng không ảnh hưởng đến việc mua vé
      console.error("Create notification error:", notifError);
    }

    res.status(201).json({
      success: true,
      message: "Mua vé thành công",
      data: ticket,
    });
  } catch (error) {
    console.error("Buy ticket error:", error);
    res.status(500).json({
      success: false,
      message: "Đã có lỗi xảy ra",
    });
  }
};

// @desc    Lấy thống kê Admin Dashboard
// @route   GET /api/lottery/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const totalPlayers = await User.countDocuments({ role: "user" });
    const totalTickets = await Ticket.countDocuments({ isActive: true }); // Chỉ vé đang hoạt động
    const totalRevenue = await Ticket.aggregate([
      { $match: { isActive: true } }, // Chỉ vé đang hoạt động
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const todayWinners = 0; // Sẽ implement sau

    res.json({
      success: true,
      data: {
        totalPlayers,
        totalTickets,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayWinners,
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy thống kê",
    });
  }
};

// @desc    Lấy danh sách người chơi gần đây
// @route   GET /api/lottery/admin/recent-players
// @access  Private/Admin
exports.getRecentPlayers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const players = await User.find({ role: "user" })
      .select("username email walletAddress balance createdAt lastLogin")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: players,
    });
  } catch (error) {
    console.error("Get recent players error:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách người chơi",
    });
  }
};

// @desc    Lấy danh sách vé của user
// @route   GET /api/lottery/my-tickets
// @access  Private
exports.getMyTickets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tickets = await Ticket.find({ user: req.user._id })
      .sort({ purchaseDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Ticket.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get my tickets error:", error);
    res.status(500).json({
      success: false,
      message: "Đã có lỗi xảy ra",
    });
  }
};

// @desc    Lấy thống kê vé số của user
// @route   GET /api/lottery/my-stats
// @access  Private
exports.getMyStats = async (req, res) => {
  try {
    const stats = await Ticket.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          totalPrize: { $sum: "$prizeAmount" },
        },
      },
    ]);

    const totalTickets = await Ticket.countDocuments({ user: req.user._id });
    const wonTickets = await Ticket.countDocuments({
      user: req.user._id,
      status: "won",
    });
    const totalSpent = await Ticket.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalWon = await Ticket.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: "$prizeAmount" } } },
    ]);

    res.json({
      success: true,
      data: {
        totalTickets,
        wonTickets,
        totalSpent: totalSpent[0]?.total || 0,
        totalWon: totalWon[0]?.total || 0,
        details: stats,
      },
    });
  } catch (error) {
    console.error("Get my stats error:", error);
    res.status(500).json({
      success: false,
      message: "Đã có lỗi xảy ra",
    });
  }
};

// @desc    Quay số trúng thưởng (Admin)
// @route   POST /api/lottery/draw
// @access  Private/Admin
exports.drawLottery = async (req, res) => {
  try {
    const { winningNumbers } = req.body;

    // Validate winning numbers
    if (!winningNumbers || winningNumbers.length !== 6) {
      return res.status(400).json({
        success: false,
        message: "Số trúng thưởng phải có đúng 6 chữ số",
      });
    }

    // Format winning number as string (e.g., "123456")
    const winningNumber = winningNumbers.join("");

    // Lấy tất cả vé với trạng thái "active"
    const activeTickets = await Ticket.find({ status: "active" }).populate(
      "user",
    );

    // Tìm những vé trúng (so sánh 3 chữ số cuối)
    const winningTickets = [];
    const losingTickets = [];

    for (const ticket of activeTickets) {
      const ticketLastThree = ticket.ticketNumber.slice(-3);
      const winningLastThree = winningNumber.slice(-3);

      if (ticketLastThree === winningLastThree) {
        winningTickets.push(ticket);
      } else {
        losingTickets.push(ticket);
      }
    }

    // Cập nhật vé thắng
    for (const ticket of winningTickets) {
      ticket.status = "won";
      ticket.drawDate = new Date();
      ticket.winningNumber = winningNumber;
      ticket.prizeAmount = ticket.amount; // Giải thưởng = tiền vé
      await ticket.save();

      // Cộng tiền thưởng cho user
      const user = await User.findById(ticket.user._id);
      user.balance += ticket.amount;
      await user.save();

      // Tạo thông báo thắng
      try {
        await Notification.create({
          user: ticket.user._id,
          type: "win",
          title: "Chúc mừng bạn đã thắng!",
          message: `Bạn đã trúng số ${winningNumber} với giải thưởng ${ticket.amount} ETH`,
          relatedTicket: ticket._id,
          isRead: false,
        });
      } catch (notifError) {
        console.error("Notification error:", notifError);
      }
    }

    // Cập nhật vé thua
    for (const ticket of losingTickets) {
      ticket.status = "lost";
      ticket.drawDate = new Date();
      ticket.winningNumber = winningNumber;
      await ticket.save();
    }

    res.json({
      success: true,
      message: "Quay số thành công",
      data: {
        winningNumber,
        totalWinners: winningTickets.length,
        prizePool: winningTickets.reduce((sum, t) => sum + t.amount, 0),
        winners: winningTickets.map((t) => ({
          username: t.user.username,
          ticketNumber: t.ticketNumber,
          prizeAmount: t.amount,
        })),
      },
    });
  } catch (error) {
    console.error("Draw lottery error:", error);
    res.status(500).json({
      success: false,
      message: "Đã có lỗi xảy ra",
    });
  }
};

// @desc    Reset tất cả vé sau khi quay (Admin) - Ẩn vé cũ
// @route   POST /api/lottery/reset-tickets
// @access  Private/Admin
exports.resetTickets = async (req, res) => {
  try {
    // Ẩn tất cả vé cũ (isActive = false) - không xoá
    const result = await Ticket.updateMany({}, { isActive: false });

    const activeCount = await Ticket.countDocuments({ isActive: true });
    const archivedCount = await Ticket.countDocuments({ isActive: false });

    console.log(`📦 Đã ẩn ${result.modifiedCount} vé`);
    console.log(
      `📊 Vé đang hoạt động: ${activeCount}, Vé đã ẩn: ${archivedCount}`,
    );

    res.json({
      success: true,
      message: "Reset vé thành công - Ẩn tất cả vé cũ",
      data: {
        archivedCount: result.modifiedCount,
        activeTickets: activeCount,
        archivedTickets: archivedCount,
      },
    });
  } catch (error) {
    console.error("Reset tickets error:", error);
    res.status(500).json({
      success: false,
      message: "Đã có lỗi xảy ra",
    });
  }
};

// @desc    Lấy lịch sử kết quả quay gần đây (Admin)
// @route   GET /api/lottery/draw-results
// @access  Private/Admin
exports.getDrawResults = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    // Lấy các vé có trạng thái "won" hoặc "lost" (đã quay)
    const results = await Ticket.find({
      drawDate: { $exists: true, $ne: null },
    })
      .select("winningNumber drawDate status")
      .sort({ drawDate: -1 })
      .limit(limit);

    // Nhóm theo winningNumber để lấy kết quả unique
    const uniqueResults = [];
    const seenNumbers = new Set();

    for (const result of results) {
      if (!seenNumbers.has(result.winningNumber)) {
        seenNumbers.add(result.winningNumber);

        // Đếm số người thắng cho số quay này
        const winnersCount = await Ticket.countDocuments({
          winningNumber: result.winningNumber,
          status: "won",
        });

        // Tính tổng giải thưởng
        const prizeData = await Ticket.aggregate([
          {
            $match: {
              winningNumber: result.winningNumber,
              status: "won",
            },
          },
          {
            $group: {
              _id: null,
              totalPrize: { $sum: "$prizeAmount" },
            },
          },
        ]);

        uniqueResults.push({
          winningNumber: result.winningNumber,
          drawDate: result.drawDate,
          winnersCount,
          totalPrize: prizeData[0]?.totalPrize || 0,
        });
      }
    }

    res.json({
      success: true,
      data: uniqueResults,
    });
  } catch (error) {
    console.error("Get draw results error:", error);
    res.status(500).json({
      success: false,
      message: "Đã có lỗi xảy ra",
    });
  }
};

// @desc    Lấy tất cả vé (Admin)
// @route   GET /api/lottery/all-tickets
// @access  Private/Admin
exports.getAllTickets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const tickets = await Ticket.find({ isActive: true }) // Chỉ vé đang hoạt động
      .populate("user", "username email")
      .sort({ purchaseDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Ticket.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get all tickets error:", error);
    res.status(500).json({
      success: false,
      message: "Đã có lỗi xảy ra",
    });
  }
};
