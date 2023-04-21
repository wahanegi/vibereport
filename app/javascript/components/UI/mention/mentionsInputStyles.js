export default {
  control: {
    backgroundColor: '#fff',
    fontSize: 23,
    fontWeight: 'normal'
  },

  '&multiLine': {
    control: {
      height: 350,
      width: 660
    },
    highlighter: {
      padding: 9,
      border: '3px solid transparent',
      borderRadius: 15,
      maxHeight: 350,
    },
    input: {
      padding: 9,
      border: '3px solid #4C77CB',
      borderRadius: 15,
      textAlign: 'left',
      boxShadow: 'none',
      overflow: 'auto',
    },
  },

  '&singleLine': {
    display: 'inline-block',
    width: 180,

    highlighter: {
      padding: 1,
      border: '2px inset transparent'
    },
    input: {
      padding: 1,
      border: '3px inset'
    },
  },

  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '6px solid #D7007B',
      fontSize: 23,
      borderRadius: 10,
      maxHeight: 205,
      overflow: 'auto'
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      color: '#666666',
      '&focused': {
        color: '#000000',
        backgroundColor: '#D2D2D2'
      },
    },
  },
}