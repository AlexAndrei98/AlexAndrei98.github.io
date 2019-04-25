/**
 * jasonpark.me - Jinseo Jason Park
 * @version v3.0.0
 * @link https://jasonpark.me/
 * @license MIT
 */
'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();function _toArray(arr) {return Array.isArray(arr) ? arr : Array.from(arr);}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}$(document).ready(function () {
  var $window = $('.window');
  var $directory = $('#directory');
  var $browser = $('#browser');
  var $terminal = $('#terminal');
  var $toolbar = $window.find('.toolbar');
  var $buttonContainer = $toolbar.find('.button-container');
  var $browserIframe = $browser.find('.iframe');
  var $browserAddressbar = $browser.find('.addressbar');
  var $html = $('html');
  var $labelClock = $('.label-clock');
  var $a = $('a');

  var zIndex = 2;
  var desktop = null;
  var mobile = null;

  var focus = function focus($selectedWindow) {
    window.location.hash = $selectedWindow.data('last-hash');
    $window.removeClass('focus');
    $selectedWindow.removeClass('minimize');
    $selectedWindow.addClass('focus');
    $selectedWindow.css('z-index', zIndex++);
  };

  var handleHashChange = function handleHashChange() {var
    hash = window.location.hash;
    if (hash.endsWith('-')) {
      var newHash = hash.substring(0, hash.length - 1);
      $(newHash).data('last-hash', null);
      window.location.hash = newHash;
      return;
    }
    var $hash = $(hash);
    if ($hash.hasClass('window', 'open')) {
      var lastHash = $hash.data('last-hash');
      if (lastHash && lastHash !== hash) {
        window.location.hash = lastHash;
        return;
      }
    }
    var selector = hash;
    if (/^#?$/.test(selector)) {
      $window.removeClass('focus');
      return;
    }
    $('a[href^=\'' + selector + '-\']').removeClass('active');
    $('[id^=\'' + selector.substring(1) + '-\']').removeClass('open');
    var parentSelectors = [selector];
    while (true) {
      var index = selector.lastIndexOf('-');
      if (!~index) break;
      selector = selector.substring(0, index);
      parentSelectors.unshift(selector);
    }
    var $selectedWindow = $(selector);
    $selectedWindow.data('last-hash', hash);
    focus($selectedWindow);
    var $firstLauncher = null;
    for (var i = 0; i < parentSelectors.length; i++) {
      var _selector = parentSelectors[i];
      var $selector = $(_selector);
      var $launcher = $('a[href=\'' + _selector + '\']');
      if ($launcher.length) {
        $firstLauncher = $launcher.first();
      }
      if (i > 0) {
        var parentSelector = parentSelectors[i - 1];
        $('a[href^=\'' + parentSelector + '-\']').removeClass('active');
        $('[id^=\'' + parentSelector.substring(1) + '-\']').removeClass('open');
      }
      $launcher.addClass('active');
      $selector.addClass('open');
    }
    var windowId = $selectedWindow.attr('id');
    switch (windowId) {
      case 'browser':{
          var $tabContainer = $selectedWindow.find('.tab-container');
          if ($hash.length) {
            var tab = $hash[0];
            tab.click();
          } else {
            var $tab = $('<a class="tab open active"></a>');
            $tab.attr('id', hash.substring(1));
            $tab.attr('href', hash);
            var url = $firstLauncher.data('url');
            $tab.data({ url: url });
            $tab.mousedown(function (e) {return e.stopPropagation();});
            var $icon = $('<div class="icon"></div>');
            var $name = $('<div class="name"></div>');
            var $close = $('<a class="close" href="#"></a>');
            $icon.css('background-image', 'url(' + $firstLauncher.data('image') + ')');
            $name.text($firstLauncher.data('name'));
            $close.attr('href', '#');
            $close.click(function (e) {
              e.preventDefault();
              var isOpen = $tab.hasClass('open');
              var prevTab = $tab.prev()[0] || $tab.next()[0];
              $tab.remove();
              if (isOpen) {
                if (prevTab) {
                  prevTab.click();
                } else {var _$selectedWindow$find =
                  $selectedWindow.find('.button-close'),_$selectedWindow$find2 = _slicedToArray(_$selectedWindow$find, 1),buttonClose = _$selectedWindow$find2[0];
                  buttonClose.click();
                }
              }
            });
            $tab.append($icon);
            $tab.append($name);
            $tab.append($close);
            $tab.click(function () {
              if ($browserIframe.attr('src') !== url) {
                $browserIframe.attr('src', url);
              }
              $browserAddressbar.find('.url').text(url);
            });
            $tab.click();
            $tabContainer.append($tab);
          }
          break;
        }
      case 'instagram':{
          var $titleContainer = $selectedWindow.find('.title-container');
          $titleContainer.empty();
          $titleContainer.append('<div class="icon icon-instagram">');
          $titleContainer.append('<div class="name">Instagram</div>');
          break;
        }
      default:{
          var _$titleContainer = $selectedWindow.find('.title-container');
          _$titleContainer.empty();
          _$titleContainer.append($firstLauncher.children().clone());
          break;
        }}

  };
  window.setTimeout(handleHashChange, 0);
  $(window).on('hashchange', handleHashChange);

  $buttonContainer.click(function () {
    if (mobile) {var _$$find =
      $(this).find('.button-close'),_$$find2 = _slicedToArray(_$$find, 1),buttonClose = _$$find2[0];
      buttonClose.click();
    }
  });
  $buttonContainer.find('.button-close').click(function (e) {
    var $selectedWindow = $(this).parents('.window');
    var id = $selectedWindow.attr('id');
    $('a[href=\'#' + id + '\']').removeClass('active');
    $selectedWindow.removeClass('open');
    $selectedWindow.data('last-hash', null);
    var windowId = $selectedWindow.attr('id');
    switch (windowId) {
      case 'terminal':
        resetTerminal();
        break;
      case 'browser':
        $selectedWindow.find('.tab-container').empty();
        $browserIframe.attr('src', null);
        $browserAddressbar.find('.url').text(null);
        break;}

  });
  $buttonContainer.find('.button-minimize').click(function (e) {
    if (mobile) return;
    var $selectedWindow = $(this).parents('.window');
    $selectedWindow.addClass('minimize');
  });
  $buttonContainer.find('.button-maximize').click(function (e) {
    if (mobile) return;
    e.preventDefault();
    var $selectedWindow = $(this).parents('.window');
    $selectedWindow.toggleClass('maximize');
  });

  $browserAddressbar.find('.button-refresh').click(function (e) {
    e.preventDefault();
    $browserIframe.attr('src', $browserIframe.attr('src'));
  });
  $browserAddressbar.find('.button-new').click(function (e) {
    e.preventDefault();
    window.open($browserIframe.attr('src'));
  });

  $('.desktop').mousedown(function () {
    window.location.hash = '#';
    $window.removeClass('focus');
  });

  $window.mousedown(function (e) {
    e.stopPropagation();
    focus($(this));
  });

  var handleDirectoryKeyDown = function handleDirectoryKeyDown(e) {
    var $selectedDirectory = $directory.find('.panel.open .directory.active').last();var
    keyCode = e.keyCode;
    switch (keyCode) {
      case 38:var _$selectedDirectory$p =
        $selectedDirectory.prev(':not(.directory-parent)'),_$selectedDirectory$p2 = _slicedToArray(_$selectedDirectory$p, 1),prevDirectory = _$selectedDirectory$p2[0];
        if (prevDirectory) prevDirectory.click();
        break;
      case 40:var _$selectedDirectory$n =
        $selectedDirectory.next(),_$selectedDirectory$n2 = _slicedToArray(_$selectedDirectory$n, 1),nextDirectory = _$selectedDirectory$n2[0];
        if (nextDirectory) nextDirectory.click();
        break;
      case 37:var _$selectedDirectory$p3 =
        $selectedDirectory.parents('.panel-container').prev().find('.panel.open .directory.active'),_$selectedDirectory$p4 = _slicedToArray(_$selectedDirectory$p3, 1),parentDirectory = _$selectedDirectory$p4[0];
        if (parentDirectory) parentDirectory.click();
        break;
      case 39:var _$selectedDirectory$p5 =
        $selectedDirectory.parents('.panel-container').next().find('.panel.open .directory:not(.directory-parent)').first(),_$selectedDirectory$p6 = _slicedToArray(_$selectedDirectory$p5, 1),childDirectory = _$selectedDirectory$p6[0];
        if (childDirectory) childDirectory.click();
        break;}

  };

  var paths = {
    users: {
      jason: {
        desktop: {} } } };



  var ids = [];
  $('*').each(function () {var
    id = this.id;
    if (id) {
      ids.push(id);
    }
  });var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
    for (var _iterator = ids[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var id = _step.value;
      var path = paths.users.jason.desktop;
      var sections = id.split('-');var _iteratorNormalCompletion7 = true;var _didIteratorError7 = false;var _iteratorError7 = undefined;try {
        for (var _iterator7 = sections[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {var section = _step7.value;
          if (!path[section]) {
            path[section] = {};
          }
          path = path[section];
        }} catch (err) {_didIteratorError7 = true;_iteratorError7 = err;} finally {try {if (!_iteratorNormalCompletion7 && _iterator7.return) {_iterator7.return();}} finally {if (_didIteratorError7) {throw _iteratorError7;}}}
    }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}

  var sourceCode = null;
  $.get('/js/script.js', function (data) {return sourceCode = data;}, 'text');

  var personalStatement = null;
  $.get('/data/personal_statement.txt', function (data) {return personalStatement = data;}, 'text');

  var currentDirectories = null;
  var inputHistory = [];
  var inputHistoryIndex = 0;
  var tabPressed = null;
  var hackertyper = null;
  var hackertyperIndex = null;
  var resetTerminal = function resetTerminal() {
    currentDirectories = ['users', 'jason', 'desktop'];
    tabPressed = false;
    resetHackertyper();
    newInputLine(true);
  };
  window.setTimeout(resetTerminal, 0);
  var resetHackertyper = function resetHackertyper() {
    hackertyper = false;
    hackertyperIndex = 0;
  };
  var newInputLine = function newInputLine() {var clear = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;var prompt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var $lineContainer = $terminal.find('.line-container');
    if (clear) {
      $lineContainer.empty();
    }
    var $newLine = $('<div class="line">');
    if (prompt) {
      var directories = [].concat(_toConsumableArray(currentDirectories));
      if (directories[0] === 'users' && directories[1] === 'jason') {
        directories.splice(0, 2, '~');
      }
      var path = directories.join('/') || '/';
      $newLine.append('jason@world:' + path + '$ ');
    }
    var $cursor = $terminal.find('.cursor');
    $cursor.removeClass('cursor');
    $newLine.append('<div class="letter cursor">');
    $lineContainer.append($newLine);
    return $newLine;
  };
  var getDirectories = function getDirectories(pathArg) {
    var tokens = pathArg ? pathArg.split('/') : [];
    var directories = [].concat(_toConsumableArray(currentDirectories));
    if (tokens[0] === '') {
      directories = [];
      tokens.shift();
    } else if (tokens[0] === '~') {
      directories = ['users', 'jason'];
      tokens.shift();
    }var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {
      for (var _iterator2 = tokens[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var token = _step2.value;
        switch (token) {
          case '':
          case '.':
            break;
          case '..':
            directories.pop();
            break;
          default:
            directories.push(token);
            break;}

      }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2.return) {_iterator2.return();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
    return directories;
  };
  var getPath = function getPath(directories) {
    var path = paths;var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {
      for (var _iterator3 = directories[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var directory = _step3.value;
        path = path[directory];
      }} catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3.return) {_iterator3.return();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}
    return path;
  };
  var getSelector = function getSelector(directories) {return '#' + directories.slice(3).join('-');};
  var print = function print(lines) {var markdown = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (!Array.isArray(lines)) lines = [lines];
    var $lineContainer = $terminal.find('.line-container');
    lines.forEach(function (line) {
      var $newLine = $('<div class="line">');
      if (markdown) {
        $newLine.html(line && line.
        replace(/([.,?!"';]*\w*[.,?!"';]*\s*)/g, '<span>$1</span>').
        replace(/\{(.+)\}/g, '<div class="underline">$1</div>&nbsp;&nbsp;').
        replace(/\*(.+)\*/g, '<div class="highlight">$1</div>'));
      } else {
        $newLine.html(line);
      }
      $lineContainer.append($newLine);
    });
  };
  var type = function type(string) {
    var $cursor = $terminal.find('.cursor');
    reattachCursor($cursor);
    if (string === undefined) return;
    var array = Array.from(string);var _iteratorNormalCompletion4 = true;var _didIteratorError4 = false;var _iteratorError4 = undefined;try {
      for (var _iterator4 = array[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {var char = _step4.value;
        if (char === '\n') {
          newInputLine(false, false);
          $cursor = $terminal.find('.cursor');
        } else {
          $cursor.before('<div class="letter">' + char + '</div>');
        }
      }} catch (err) {_didIteratorError4 = true;_iteratorError4 = err;} finally {try {if (!_iteratorNormalCompletion4 && _iterator4.return) {_iterator4.return();}} finally {if (_didIteratorError4) {throw _iteratorError4;}}}
  };
  var reattachCursor = function reattachCursor($cursor) {
    $cursor.prev().after($cursor);
  };
  var isDir = function isDir(path, directory) {return Object.keys(path[directory]).length > 0;};
  var processCommand = function processCommand(input) {var _input$split =
    input.split(/\s+/),_input$split2 = _toArray(_input$split),command = _input$split2[0],args = _input$split2.slice(1);
    var pathArgs = args.filter(function (arg) {return !arg.startsWith('-');});
    var optionArg = args.find(function (arg) {return arg.startsWith('-');});
    var options = optionArg ? optionArg.substring(1).split('') : [];
    switch (command) {
      case '':
        break;
      case 'help':{
          print([
          ' *help*            show all the possible commands',
          ' *whoami* [-j]     display information about Jason',
          ' *cd* {dir}        change the working directory',
          ' *ls* {dir}        list directory contents',
          ' *pwd*             return the working directory',
          ' *rm* [-fr] {dir}  remove directory entries',
          ' *open* {files}    open the files',
          ' *clear*           clear the terminal screen',
          ' *exit*            close the terminal window',
          ' *hackertyper*     ?????'],
          true);
          break;
        }
      case 'whoami':{
          if (options.includes('j')) {
            print([
            '*Jinseo Jason Park*',
            ''].concat(_toConsumableArray(
            personalStatement.split('\n'))),
            true);
          } else {
            print([
            '*Jinseo Jason Park*',
            'I am a developer, hackathoner, and backpacker.',
            'Type "*whoami -j*" to show my journey so far.'],
            true);
          }
          break;
        }
      case 'cd':{
          var pathArg = pathArgs.shift();
          var directories = getDirectories(pathArg);
          var path = getPath(directories);
          if (path === undefined) {
            print('-bash: ' + command + ': ' + pathArg + ': No such file or directory');
            break;
          } else if (Object.keys(path).length === 0) {
            print('-bash: ' + command + ': ' + pathArg + ': Not a directory');
            break;
          }
          currentDirectories = [].concat(_toConsumableArray(directories));
          break;
        }
      case 'ls':{
          var _pathArg = pathArgs.shift();
          var _directories = getDirectories(_pathArg);
          var _path = getPath(_directories);
          if (_path === undefined) {
            print('-bash: ' + command + ': ' + _pathArg + ': No such file or directory');
            break;
          } else if (Object.keys(_path).length === 0) {
            print('<div class="file">' + _directories.pop() + '</div>');
            break;
          }
          print(Object.keys(_path).map(function (directory) {return '<div class="' + (isDir(_path, directory) ? 'dir' : 'file') + '">' + directory + '</div>';}));
          break;
        }
      case 'pwd':{
          print('/' + currentDirectories.join('/'));
          break;
        }
      case 'rm':{
          var _pathArg2 = pathArgs.shift();
          var _directories2 = getDirectories(_pathArg2);
          var _path2 = getPath(_directories2);
          if (_path2 === undefined) {
            print('-bash: ' + command + ': ' + _pathArg2 + ': No such file or directory');
            break;
          } else {
            if (Object.keys(_path2).length && !options.includes('r')) {
              print('-bash: ' + command + ': ' + _pathArg2 + ': Is a directory');
              break;
            }
            var selector = getSelector(_directories2);
            // TODO: wildcard selector?
            if (selector === '#') {
              if (!options.includes('f')) {
                print('-bash: ' + command + ': ' + _pathArg2 + ': Permission denied (try again with -f)');
                break;
              }
              $('.desktop').remove();
            } else {
              $('a[href=\'' + selector + '\']').remove();
              $('[id=\'' + selector.substring(1) + '\']').remove();
              $('a[href^=\'' + selector + '-\']').remove();
              $('[id^=\'' + selector.substring(1) + '-\']').remove();
            }
            var directory = _directories2.pop();
            delete getPath(_directories2)[directory];
            break;
          }
        }
      case 'open':{
          var delay = 0;var _iteratorNormalCompletion5 = true;var _didIteratorError5 = false;var _iteratorError5 = undefined;try {var _loop = function _loop() {var
              pathArg = _step5.value;
              var directories = getDirectories(pathArg);
              var path = getPath(directories);
              if (path === undefined) {
                print('The file /' + directories.join('/') + ' does not exist.');
                return 'continue';
              }
              if (directories[0] === 'users' && directories[1] === 'jason' && directories[2] === 'desktop') {
                directories.splice(0, 3);
              }
              var hash = '#' + directories.join('-');
              if (hash === '#' || !$(hash).length) {
                print('-bash: ' + command + ': ' + pathArg + ': Permission denied');
                return 'continue';
              }
              window.setTimeout(function () {
                window.location.hash = hash;
              }, delay += 200);};for (var _iterator5 = pathArgs[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {var _ret = _loop();if (_ret === 'continue') continue;
            }} catch (err) {_didIteratorError5 = true;_iteratorError5 = err;} finally {try {if (!_iteratorNormalCompletion5 && _iterator5.return) {_iterator5.return();}} finally {if (_didIteratorError5) {throw _iteratorError5;}}}
          break;
        }
      case 'clear':{
          newInputLine(true);
          return;
        }
      case 'exit':{var _$terminal$find =
          $terminal.find('.button-close'),_$terminal$find2 = _slicedToArray(_$terminal$find, 1),buttonClose = _$terminal$find2[0];
          buttonClose.click();
          return;
        }
      case 'hackertyper':{
          if (sourceCode) {
            hackertyper = true;
            newInputLine(true, false);
            return;
          } else {
            print('Error occurred while loading source code.');
          }
          break;
        }
      default:{
          print('-bash: ' + command + ': command not found');
          break;
        }}

    newInputLine();var _$terminal$find3 =
    $terminal.find('.cursor'),_$terminal$find4 = _slicedToArray(_$terminal$find3, 1),cursor = _$terminal$find4[0];
    cursor.scrollIntoView();
  };
  var handleTerminalKeyDown = function handleTerminalKeyDown(e) {var
    keyCode = e.keyCode;
    switch (keyCode) {
      case 8:
      case 9:
      case 13:
      case 27:
      case 37:
      case 38:
      case 39:
      case 40:
        e.preventDefault();
        break;}

    if (hackertyper && keyCode !== 27) return;
    var $cursor = $terminal.find('.cursor');
    var $prev = $cursor.prev('.letter');
    var $next = $cursor.next('.letter');
    var $line = $cursor.parents('.line');
    switch (keyCode) {
      case 8:{
          if ($prev.length) {
            $prev.remove();
            reattachCursor($cursor);
          }
          break;
        }
      case 9:{
          if (!$next.length) {
            var input = $line.children('.letter').text();
            var incompletePathArg = input.split(/\s+/).pop();
            var index = incompletePathArg.lastIndexOf('/');
            var parentDirectory = incompletePathArg.substring(0, index + 1);
            var incompleteDirectory = incompletePathArg.substring(index + 1);
            var directories = getDirectories(parentDirectory);
            var path = getPath(directories);
            if (path) {
              var possibleDirectories = Object.keys(path).filter(function (directory) {return directory.startsWith(incompleteDirectory);});
              if (possibleDirectories.length === 1) {
                var directory = possibleDirectories[0];
                var leftover = directory.substring(incompleteDirectory.length);
                type(leftover);
              } else if (possibleDirectories.length > 1) {
                if (tabPressed) {
                  $cursor.detach();
                  $line.before($line.clone());var _iteratorNormalCompletion6 = true;var _didIteratorError6 = false;var _iteratorError6 = undefined;try {
                    for (var _iterator6 = possibleDirectories[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {var _directory = _step6.value;
                      $line.before('<div class="line"><div class="' + (isDir(path, _directory) ? 'dir' : 'file') + '">' + _directory + '</div></div>');
                    }} catch (err) {_didIteratorError6 = true;_iteratorError6 = err;} finally {try {if (!_iteratorNormalCompletion6 && _iterator6.return) {_iterator6.return();}} finally {if (_didIteratorError6) {throw _iteratorError6;}}}
                  $cursor.appendTo($line);
                }
                tabPressed = true;
              }
            }
          }
          break;
        }
      case 13:{
          var _input = $line.children('.letter').text();
          inputHistory.push(_input);
          inputHistoryIndex = inputHistory.length;
          processCommand(_input);
          break;
        }
      case 27:{
          resetHackertyper();
          newInputLine();
          break;
        }
      case 37:{
          if ($prev.length) {
            $prev.addClass('cursor');
            $cursor.removeClass('cursor');
          }
          break;
        }
      case 38:{
          if (inputHistoryIndex > 0) {
            var _input2 = inputHistory[--inputHistoryIndex];
            $cursor.detach();
            $line.find('.letter').remove();
            $line.append($cursor);
            type(_input2);
          }
          break;
        }
      case 39:{
          if ($next.length) {
            $next.addClass('cursor');
            $cursor.removeClass('cursor');
          }
          break;
        }
      case 40:{
          if (inputHistoryIndex < inputHistory.length) {
            var _input3 = inputHistory[++inputHistoryIndex];
            $cursor.detach();
            $line.find('.letter').remove();
            $line.append($cursor);
            type(_input3);
          }
          break;
        }}

    if (keyCode !== 9) tabPressed = false;var _$cursor = _slicedToArray(
    $cursor, 1),cursor = _$cursor[0];
    cursor.scrollIntoView();
  };
  var handleTerminalKeyPress = function handleTerminalKeyPress(e) {
    var keyCode = e.charCode || e.keyCode;
    if (keyCode === 3) {
      resetHackertyper();
      newInputLine();
    } else if (keyCode >= 32) {
      if (hackertyper) {
        var randomLength = (Math.random() * 8 | 0) + 1;
        var string = sourceCode.substr(hackertyperIndex, randomLength);
        if (!string) {
          resetHackertyper();
          newInputLine();
        }
        hackertyperIndex += randomLength;
        type(string);
      } else {
        var _string = String.fromCharCode(keyCode);
        type(_string);
      }
    }var _$terminal$find5 =
    $terminal.find('.cursor'),_$terminal$find6 = _slicedToArray(_$terminal$find5, 1),cursor = _$terminal$find6[0];
    cursor.scrollIntoView();
  };


  $(document).keydown(function (e) {
    if ($directory.hasClass('focus')) {
      handleDirectoryKeyDown(e);
    } else if ($terminal.hasClass('focus')) {
      handleTerminalKeyDown(e);
    }
  });
  $(document).keypress(function (e) {
    if ($terminal.hasClass('focus')) {
      handleTerminalKeyPress(e);
    }
  });

  $window.each(function (i) {
    var top = 20 + i * 20;
    var left = 20 + i * 20;
    $(this).css({ top: top, left: left });
  });

  var $selectedWindow = null;
  var windowStyle = {};
  var cursor = {};
  $toolbar.mousedown(function (e) {
    if (mobile) return;
    if (e.which !== 1) return;
    $selectedWindow = $(this).parents('.window');
    if ($selectedWindow.hasClass('maximize')) return;
    $selectedWindow.addClass('moving');
    windowStyle = $selectedWindow.position();
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    $(document).mousemove(function (e) {
      var dx = e.clientX - cursor.x;
      var dy = e.clientY - cursor.y;
      windowStyle.left += dx;
      windowStyle.top += dy;
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      $selectedWindow.css(windowStyle);
    });
    $(document).mouseup(function () {
      $selectedWindow.removeClass('moving');
      $(document).off('mousemove');
      $(document).off('mouseup');
    });
  });
  $a.mousedown(function (e) {
    e.stopPropagation();
  });
  [
  ['.border-left', 'left', 'width', 'x', 'clientX'],
  ['.border-top', 'top', 'height', 'y', 'clientY'],
  ['.border-right', null, 'width', 'x', 'clientX'],
  ['.border-bottom', null, 'height', 'y', 'clientY']].
  map(function (_ref) {var _ref2 = _slicedToArray(_ref, 5),selector = _ref2[0],pos = _ref2[1],dim = _ref2[2],xy = _ref2[3],clientXY = _ref2[4];
    var $selectedWindow = null;
    var windowStyle = {};
    var cursor = {};
    $window.find(selector).mousedown(function (e) {
      if (mobile) return;
      if (e.which !== 1) return;
      $selectedWindow = $(this).parents('.window');
      if ($selectedWindow.hasClass('maximize')) return;
      $selectedWindow.addClass('resizing');
      if (pos) {
        var position = $selectedWindow.position();
        windowStyle[pos] = position[pos];
      }
      windowStyle[dim] = $selectedWindow[dim]();
      cursor[xy] = e[clientXY];
      $(document).mousemove(function (e) {
        var delta = e[clientXY] - cursor[xy];
        if (pos) {
          windowStyle[pos] += delta;
          windowStyle[dim] -= delta;
        } else {
          windowStyle[dim] += delta;
        }
        cursor[xy] = e[clientXY];
        if (windowStyle.width < 280 || windowStyle.height < 60) return;
        $selectedWindow.css(windowStyle);
      });
      $(document).mouseup(function () {
        $selectedWindow.removeClass('resizing');
        $(document).off('mousemove');
        $(document).off('mouseup');
      });
    });
  });

  var refreshClock = function refreshClock() {
    var two = function two(x) {return x < 10 ? '0' + x : x;};
    var date = new Date();
    var H = date.getHours();
    var m = date.getMinutes();
    var hh = two(H % 12 || 12);
    var mm = two(m);
    var A = ['AM', 'PM'][H / 12 | 0];
    var format = hh + ':' + mm + ' ' + A;
    $labelClock.find('.name').text(format);
  };
  window.setInterval(refreshClock, 1000);
  refreshClock();

  $a.each(function () {
    var href = $(this).attr('href');
    if (!href.startsWith('#')) {
      $(this).attr('target', '_blank');
      $(this).attr('rel', 'noopener');
      $(this).addClass('link-external');
    }
  });

  var onResize = function onResize() {var
    clientWidth = document.body.clientWidth;
    desktop = clientWidth > 512;
    mobile = !desktop;
    $html.toggleClass('desktop', desktop);
    $html.toggleClass('mobile', mobile);
  };
  onResize();
  window.onresize = onResize;
});