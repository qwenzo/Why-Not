var mongoose = require('mongoose');
var moment = require('moment');

var ScheduleSchema = mongoose.Schema({
    expertID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
    },
    startDate: {
        type: String,
        required: true,
        default: moment(new Date()).startOf('week').isoWeekday(6).format('D-MMMM-YY')
    },
    endDate: {
        type: String,
        required: true,
        default: moment(new Date()).startOf('week').isoWeekday(6 + 6).format('D-MMMM-YY')
    },
    slots:[
        {
            users: [{ type: mongoose.Schema.Types.ObjectId , ref: 'User' }],
            day : Number,
            time : Number,
            status: String,
            _id: false 
        }
    ]

}, { collection: 'Schedule' }
);

module.exports = mongoose.model('Schedule', ScheduleSchema);