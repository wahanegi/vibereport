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
      borderRadius: 15
    },
    input: {
      padding: 9,
      border: '3px solid silver',
      borderRadius: 15,
      textAlign: 'left',
      boxShadow: 'none',
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
      borderRadius: 10
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#cee4e5'
      },
    },
  },
}