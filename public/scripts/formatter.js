var formatter = {
  formatBlogpost: function(blogpost){
    return {
      title: blogpost.title,
      content: {
        summary: blogpost.summary,
        full: blogpost.full
      },
      date: blogpost.date,
      order: blogpost.order
    };
  },

  formatDate: function(date){
    return date.toLocaleString(
      "en-US",
      {
        timeZone: "America/New_York",
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    );
  }
};

module.exports = formatter;
