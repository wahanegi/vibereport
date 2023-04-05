export default {
  control: {
    backgroundColor: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
  },

  '&multiLine': {
    control: {
      minHeight: '45vh',
      width: '50vw'
    },
    highlighter: {
      padding: 9,
      border: '3px solid transparent',
      borderRadius: 15,
    },
    input: {
      padding: 9,
      border: '1px solid silver',
      borderRadius: 15,
      textAlign: 'left',
    },
  },

  '&singleLine': {
    display: 'inline-block',
    width: 180,

    highlighter: {
      padding: 1,
      border: '2px inset transparent',
    },
    input: {
      padding: 1,
      border: '2px inset',
    },
  },

  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '3px solid #D7007B',
      fontSize: 14,
      borderRadius: 10,
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