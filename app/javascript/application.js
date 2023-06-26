// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import Chartkick from 'chartkick';
window.Chartkick = Chartkick;


import jquery from 'jquery';
window.jQuery = jquery;
window.$ = jquery;