const moment = require('moment');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = {
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
      return new_str + '...';
    }
    return str;
  },
  stripTags: function (input) {
    // return input.replace(/<(?:.|\n)*?/gm, '');
    return input.replace(/<\/?[\w\s]*>|<.+[\W]>/g, '');

  },
  formatDate: function (date, format) {
    return moment(date).format(format);
  },
  select: function (selected, options) {
    return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace(new RegExp('>' + selected + '</option>'), 'selected="selected"$&');
  },
  stripHtml: function (html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    // Create a new div element
    var temporalDivElement = document.createElement("div");
    // Set the HTML content with the providen
    temporalDivElement.innerHTML = html;
    // Retrieve the text property of the element (cross-browser support)
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
  },
  editIcon: function (storyUser, loggedUser, storyId, floating = true) {
    if (storyUser == loggedUser) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab red">
        <i class="fas fa-edit"></i>
      </a>`
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
      }
    } else {
      return '';
    }
  }
}