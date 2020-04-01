window['console'] = {
    log: (text) => {
      try {
        if (typeof text !== 'string') {
          text = JSON.stringify(text);
        }
        const output = window.parent.document.getElementById('output');
        const div = document.createElement('div');
        div.setAttribute('class', 'output-log');
        div.setAttribute('style', 'color: #c3c3c3; padding-left: 10px;background: #6d6d6d; height: 30px; line-height: 30px;border-bottom: 1px solid gray;text-overflow:ellipsis;white-space:nowrap;padding-right:10px;width:100%;overflow:hidden;');
        div.appendChild(document.createTextNode(text));
        output.appendChild(div);
        div.scrollIntoView();
      } catch (error) {
        console.error(error);
      }
    },
    error: (text) => {
      if (typeof text !== 'string') {
        text = JSON.stringify(text);
      }
      const output = window.parent.document.getElementById('output');
      const div = document.createElement('div');
      div.setAttribute('class', 'output-error');
      div.setAttribute('style', 'color: red; padding-left: 10px;background: #734141; height: 30px; line-height: 30px;border-bottom: 1px solid gray;text-overflow:ellipsis;white-space:nowrap;padding-right:10px;width:100%;overflow:hidden;');
      div.appendChild(document.createTextNode(text));
      output.appendChild(div);
      div.scrollIntoView();
    },
    warn: (text) => {
      if (typeof text !== 'string') {
        text = JSON.stringify(text);
      }
      const output = window.parent.document.getElementById('output');
      const div = document.createElement('div');
      div.setAttribute('class', 'output-warn');
      div.setAttribute('style', 'color: #ffd400; padding-left: 10px;background: #6c6d29; height: 30px; line-height: 30px;border-bottom: 1px solid gray;text-overflow:ellipsis;white-space:nowrap;padding-right:10px;width:100%;overflow:hidden;');
      div.appendChild(document.createTextNode(text));
      output.appendChild(div);
      div.scrollIntoView();
    }
  };
  
  