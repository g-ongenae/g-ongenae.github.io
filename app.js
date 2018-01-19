function init(path) {
 loadJSON(path, function(response) {
  // Parse JSON string into object
    var ac = JSON.parse(response);
    console.log(ac);
    return ac;
 });
}

Moon.use(MoonRouter);

const router = new MoonRouter({
  default: '/',
  map: {
    '/': 'Home',
    '/resume': 'Resume',
    '/profiles': 'Profiles',
    '/contact': 'Contact',
    '/writer': 'Writer',
    '/dev': 'Dev',
    '/challenges': 'Challenges'
  }
});

Moon.component('Home', {
  template: `<div>
    <img alt="Guillaume Ongenae" src="img/GuillaumeOngenae.jpg" />
    <h1> Hey! Je suis Guillaume Ongenae </h1>
    <h2>
      Développeur Back End en stage le jour. <br/>
      Apprenti écrivain la nuit. <br/>
    </h2>
    <ul>
        <li> <router-link to="/resume">👨‍💼 Mon CV</router-link> </li>
        <li> <router-link to="/profiles">🤖 Tous mes réseaux</router-link> </li>
        <li> <router-link to="/contact">🐦 Me Contacter</router-link> </li>
        <li> <a href="https://g-ongenae.github.io/til/">👨‍🏫 Today I Learned</a> </li>
    </ul>
  </div>`
});

Moon.component('Profiles', {
  template: `<div>
    <h1> Profiles on the net: </h1>
    <ul>
      <li m-for="item in profiles"> <a href="{{item.link}}"> {{item.name}} </a> </li>
    </ul>
  </div>`,
  data: function() {
    return {
      profiles: init('./data/profiles.json')
    };
  }
});

Moon.component('Contact', {
  template: `<div>
    <h1> Hey! Je suis Guillaume Ongenae </h1>
    <h4> Let's get in touch 😃, <a href="https://twitter.com/intent/tweet?text=Hey @g_ongenae, let's get in touch !"> tweet me @g_ongenae </a> </h4>
  </div>`
});

Moon.component('Resume', {
  template: `<div>
    <h1> Hey! Je suis Guillaume Ongenae </h1>
    <h4> Let's get in touch 😃, <a href="https://twitter.com/intent/tweet?text=Hey @g_ongenae, let's get in touch !"> tweet me @g_ongenae </a> </h4>
  </div>`
});

const app = new Moon({
  el: '#app',
  router: router,
});
