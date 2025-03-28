export const GIPHY_URL = '//api.giphy.com/v1/gifs/';

export const GIPHY_INSTRUCTION_URL = 'https://docs.google.com/document/d/19VOqimOtENKUB0HqaPQ5-6iBx6YdJv90MBDwVQ8ZC_0/edit'

export const EMOTION_COLORS = {
    negative: {
      5: '#F18C59',
      4: '#F09D74',
      3: '#F5C1A6',
      2: '#F7CDB8',
      1: '#FADFD1',
    },
    positive: {
      5: '#80D197',
      4: '#A6DFB6',
      3: '#B9E6C6',
      2: '#CCEDD5',
      1: '#D9F1E0',
    },
  };

  export const FLAME_IMAGE_SIZES = [
    {width: '55px', height: '70px', marginTop: '241px'},
    {width: '84px', height: '98px', marginTop: '213px'},
    {width: '145px', height: '133.5px', marginTop: '177.5px'},
    {width: '169px', height: '159px', marginTop: '152px'},
    {width: '185px', height: '196px', marginTop: '115px'},
    {width: '208px', height: '253px', marginTop: '58px'},
    {width: '211px', height: '239px', marginTop: '72px'},
    {width: '221px', height: '271px', marginTop: '40px'},
    {width: '382px', height: '311px', marginTop: '0'},
  ];

export const EMOTION_COL_NUMBERS = 6
export const MIN_USERS_RESPONSES = 4
export const MIN_MANAGER_USERS_RESPONSES = 1
export const MAX_CHAR_LIMIT = 700

export const EMOJIS_PER_PAGE = 5;

// Import images for progress menu
import complete0 from '../../../assets/images/progress_menu/complete0.png'
import complete0_act from '../../../assets/images/progress_menu/complete0_act.png'
import complete5_10 from '../../../assets/images/progress_menu/complete5_10.png'
import complete5_10_act from '../../../assets/images/progress_menu/complete5_10_act.png'
import complete15 from '../../../assets/images/progress_menu/complete15.png'
import complete15_act from '../../../assets/images/progress_menu/complete15_act.png'
import complete20 from '../../../assets/images/progress_menu/complete20.png'
import complete20_act from '../../../assets/images/progress_menu/complete20_act.png'
import complete25 from '../../../assets/images/progress_menu/complete25.png'
import complete25_act from '../../../assets/images/progress_menu/complete25_act.png'
import complete35 from '../../../assets/images/progress_menu/complete35.png'
import complete35_act from '../../../assets/images/progress_menu/complete35_act.png'
import complete45 from '../../../assets/images/progress_menu/complete45.png'
import complete45_act from '../../../assets/images/progress_menu/complete45_act.png'
import complete50 from '../../../assets/images/progress_menu/complete50.png'
import complete50_act from '../../../assets/images/progress_menu/complete50_act.png'
import complete65 from '../../../assets/images/progress_menu/complete65.png'
import complete65_act from '../../../assets/images/progress_menu/complete65_act.png'
import complete85 from '../../../assets/images/progress_menu/complete85.png'
import complete85_act from '../../../assets/images/progress_menu/complete85_act.png'
import complete90 from '../../../assets/images/progress_menu/complete90.png'
import complete90_act from '../../../assets/images/progress_menu/complete90_act.png'
import complete100 from '../../../assets/images/progress_menu/complete100.png'
import complete100_act from '../../../assets/images/progress_menu/complete100_act.png'

// Grouping all images for progress menu
export const SEGMENTS_MAP = {
  'emotion-selection-web': {src: complete0, activeSrc: complete0_act, percent: 0},
  'emotion-entry': {src: complete5_10, activeSrc: complete5_10_act, percent: 5},
  'emotion-type': {src: complete5_10, activeSrc: complete5_10_act, percent: 5},
  'meme-selection': {src: complete5_10, activeSrc: complete5_10_act, percent: 10},
  'selected-giphy-follow': {src: complete15, activeSrc: complete15_act, percent: 15},
  'emotion-intensity': {src: complete20, activeSrc: complete20_act, percent: 20},
  'rather-not-say': {src: complete20, activeSrc: complete20_act, percent: 20},
  'skip-ahead': {src: complete20, activeSrc: complete20_act, percent: 20},
  'productivity-check': {src: complete25, activeSrc: complete25_act, percent: 25},
  'productivity-bad-follow-up': {src: complete35, activeSrc: complete35_act, percent: 35},
  'causes-to-celebrate': {src: complete45, activeSrc: complete45_act, percent: 45},
  'timesheet': { src: complete50, activeSrc: complete50_act, percent: 50 },
  'recognition': {src: complete65, activeSrc: complete65_act, percent: 65},
  'icebreaker-answer': {src: complete85, activeSrc: complete85_act, percent: 85},
  'icebreaker-question': {src: complete90, activeSrc: complete90_act, percent: 90},
  'results': {src: complete100, activeSrc: complete100_act, percent: 100},
  'result-managers': {src: complete100, activeSrc: complete100_act, percent: 100},
};