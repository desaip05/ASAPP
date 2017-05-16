angular.module('asapp.services', [])

.service('TimeService', function($filter, moment) {
  return {
    getRelativeTime: function(time, chat) {
      var currTime = new Date();
      var REFERENCE = moment(currTime);
      var TODAY = REFERENCE.clone().startOf('day');
      var YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');
      var A_WEEK_OLD = REFERENCE.clone().subtract(6, 'days').startOf('day');
      var timeStr = "";
      time = new Date(time);
      if (moment(time).isSame(TODAY, 'd')) {
        //today
        // timeStr = $filter('date')(time, "hh:mm a").toString();
        if (chat) {
          timeStr = "Today";
        } else {
          timeStr = moment(time).format('hh:mm a');
        }
      } else if (moment(time).isSame(YESTERDAY, 'd')) {
        //yesterday
        timeStr = "Yesterday";
      } else if (moment(time).isAfter(A_WEEK_OLD)) {
        //same week
        timeStr = moment(time).format('dddd');
      } else if((currTime.getMonth() === time.getMonth()) && (currTime.getFullYear() === time.getFullYear())){
        //same month but diff week
        // timeStr = $filter('date')(time, "EEE - MMM dd").toString();
        timeStr = moment(time).format('ddd - MMM DD');
      } else if((currTime.getFullYear() === time.getFullYear())){
        //same year but diff month
        // timeStr = $filter('date')(time, "MMM dd").toString();
        timeStr = moment(time).format('MMM DD');
      } else {
        //different year
        // timeStr = $filter('date')(time, "MMM dd, yyyy").toString();
        timeStr = moment(time).format('MMM DD, YYYY');
      }
      // console.log(timeStr);
      return timeStr;
    }
  };
})
