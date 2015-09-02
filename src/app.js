var React = require('react');

var App = React.createClass({
  getInitialState: function() {
      return {
        commands: {},
        history: [],
        prompt: '$ '
      }
  },
  clearHistory: function() {
      this.setState({ history: [] });
  },
  registerCommands: function() {
    this.setState({
      commands: {
        'clear' : this.clearHistory,
        'ls'    : this.listFiles,
        'intro' : this.showWelcomeMsg,
        'help'  : this.showHelp,
        'cat'   : this.catFile,
	'linkedin': this.openLink('https://in.linkedin.com/in/premsompura'),
        'github': this.openLink('http://github.com/premsompura'),
        'blog'  : this.openLink('http://blog.premsompura.me')
      }
    });
  },
  listFiles: function() {
      this.addHistory("README.md");
  },
  showWelcomeMsg: function() {
      this.addHistory("Hi! I'm Prem Sompura, welcome to my realm. DevOps Engineer is what I'm known for. Automation, Infrastructure as Code, AWS, Deployment, CI, CD makes me fancy. Love Python. Give me a cup of Coffee and Playstation, I'm Yours !! :D");
      this.addHistory("Type `help` to explore.");
  },
  catFile: function(arg) {
      if (arg === "README.md") {
          this.addHistory("Adios, Thanks for visiting.");
          this.addHistory("type `source` to view the source code");
      } else {
          this.addHistory("cat: " +  arg + ": No such file or directory");
      }
  },
  openLink: function(link) {
      return function() {
        window.open(link, '_blank');
      }
  },
  showHelp: function() {
      this.addHistory("help - this help text");
      this.addHistory("github - view my github profile");
      this.addHistory("intro - print intro message");
      this.addHistory("blog - read some stuff that I've written");
      this.addHistory("clear - clear screen");
      this.addHistory("cat - print contents of a file");
      this.addHistory("ls - list files");
  },
  componentDidMount: function() {
      var term = this.refs.term.getDOMNode();

      this.registerCommands();
      this.showWelcomeMsg();
      term.focus();
  },
  componentDidUpdate: function() {
      var el = React.findDOMNode(this);
      //var container = document.getElementsByClassName('container')[0];
      var container = document.getElementById("main");
      container.scrollTop = el.scrollHeight;
  },
  handleInput: function(e) {
      if (e.key === "Enter") {
          var input_text = this.refs.term.getDOMNode().value;
          var input_array = input_text.split(' ');
          var input = input_array[0];
          var arg = input_array[1];
          var command = this.state.commands[input];

          this.addHistory(this.state.prompt + " " + input_text);

          if (command === undefined) {
              this.addHistory("sh: command not found: " + input);
          } else {
              command(arg);
          }
          this.clearInput();
      }
  },
  clearInput: function() {
      this.refs.term.getDOMNode().value = "";
  },
  addHistory: function(output) {
    var history = this.state.history;
    history.push(output)
    this.setState({
      'history': history
    });
  },
  handleClick: function() {
    var term = this.refs.term.getDOMNode();
    term.focus();
  },
  render: function() {
      var output = this.state.history.map(function(op, i) {
          return <p key={i}>{op}</p>
      });
      return (
        <div className='input-area' onClick={this.handleClick}>
          {output}
          <p>
            <span className="prompt">{this.state.prompt}</span> 
            <input type="text" onKeyPress={this.handleInput} ref="term" />
          </p>
        </div>
      )
  }
});

// render it dawg!
var AppComponent = React.createFactory(App);
React.render(AppComponent(), document.getElementById('app'));
