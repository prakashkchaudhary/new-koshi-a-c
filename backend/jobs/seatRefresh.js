const cron = require('node-cron');
const Booking = require('../models/Booking');
const Bus = require('../models/Bus');

/**
 * Auto-refresh seats every 24 hours
 * Removes bookings older than 24 hours from travel date
 * Frees up seats for new bookings
 */
const startSeatRefreshJob = () => {
  // Run every hour to check for expired bookings
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('🔄 Running seat refresh job...');
      
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      // Find all bookings where travel date has passed
      const expiredBookings = await Booking.find({
        travelDate: { $lt: yesterday },
        status: 'confirmed'
      }).populate('busId');
      
      if (expiredBookings.length === 0) {
        console.log('✅ No expired bookings found');
        return;
      }
      
      console.log(`📊 Found ${expiredBookings.length} expired bookings`);
      
      // Free up seats for each expired booking
      for (const booking of expiredBookings) {
        if (booking.busId) {
          await Bus.findByIdAndUpdate(booking.busId._id, {
            $pull: { bookedSeats: { $in: booking.seats } }
          });
          
          // Mark booking as completed/expired
          booking.status = 'cancelled';
          booking.cancellationReason = 'Auto-cancelled: Travel date passed';
          await booking.save();
          
          console.log(`✅ Freed seats for booking ${booking.ticketId}`);
        }
      }
      
      console.log('✅ Seat refresh job completed');
    } catch (error) {
      console.error('❌ Seat refresh job error:', error.message);
    }
  });
  
  console.log('✅ Seat refresh job scheduled (runs every hour)');
};

/**
 * Clean up old cancelled bookings (older than 30 days)
 */
const startCleanupJob = () => {
  // Run daily at 2 AM
  cron.schedule('0 2 * * *', async () => {
    try {
      console.log('🧹 Running cleanup job...');
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const result = await Booking.deleteMany({
        status: 'cancelled',
        updatedAt: { $lt: thirtyDaysAgo }
      });
      
      console.log(`✅ Cleaned up ${result.deletedCount} old cancelled bookings`);
    } catch (error) {
      console.error('❌ Cleanup job error:', error.message);
    }
  });
  
  console.log('✅ Cleanup job scheduled (runs daily at 2 AM)');
};

module.exports = { startSeatRefreshJob, startCleanupJob };
