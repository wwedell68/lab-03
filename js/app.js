'use strict';

function Horn(horn) {
  this.title = horn.title;
  this.image_url = horn.image_url;
  this.description = horn.description;
  this.keyword = horn.keyword;
  this.horns = horn.horns;
}

Horn.allHorns = [];

Horn.prototype.render = function() {
  $('main').append('<div class="clone"></div>');
  let hornClone = $('div[class="clone"]');
  hornClone.html($('#photo-template').html());
  hornClone.find('h2').text(this.title);
  hornClone.find('img').attr('src', this.image_url);
  hornClone.find('p').text(this.description);
  hornClone.removeClass('clone');
  hornClone.attr('class', this.keyword);
};

Horn.readJson = () => {
  if($('#page-select').val() === 'default') {

    $.get('data/page-1.json', 'json')
      .then(data => {
        data.forEach(item => {
          Horn.allHorns.push(new Horn(item));
        });

        Horn.allHorns.forEach(horn => {
          $('main').append(horn.render());
        });
      })
      .then(Horn.populateFilter)
      .then(Horn.handleFilter);
  }
};

Horn.populateFilter = () => {
  let filterKeywords = [];

  $('option')
    .not(':first')
    .remove();

  Horn.allHorns.forEach(horn => {
    if (!filterKeywords.includes(horn.keyword))
      filterKeywords.push(horn.keyword);
  });
  filterKeywords.sort();
  filterKeywords.forEach(key => {
    let optionTag = `<option value= '${key}'>${key}</option>`;
    $('#select').append(optionTag);
  });
};

Horn.handleFilter = () => {
  $('select').on('change', function() {
    let $selected = $(this).val();
    console.log($selected);
    if ($selected !== 'default') {
      $('div').hide();

      Horn.allHorns.forEach(horn => {
        if ($selected === horn.keyword) {
          $(`div[class="${$selected}"`).addClass('filtered').fadeIn();
        }
      });

      $(`option[value=${$selected}]`).fadeIn();
    } else {
      console.log('test');
      $('div')
        .removeClass('filtered')
        .fadeIn();
      $(`option[value=${$selected}]`).fadeIn();
    }
  });
};
Horn.loadHorn = () => {
  Horn.allHorns.forEach(horn => horn.render());
};
$(() => Horn.readJson());
