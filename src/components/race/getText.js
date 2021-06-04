export default () => {
  const texts = [
    "We must be willing to let go of the life we have planned, so as to have the life that is waiting for us."
    + " Life is a dream for the wise, a game for the fool, a comedy for the rich, a tragedy for the poor.",

    " Never be bullied into silence. Never allow yourself to be made a victim. Accept no one's definition of your life; define yourself.",

    " Life is what happens while you are busy making other plans."
    + " you can't do is ignore them. Because they change things. They push the human race forward. And"
    + " Sometimes life hits you in the head with a brick. Don't lose faith."
    + " We do not remember days, we remember moments.",

    "The truth is you don't know what is going to happen tomorrow. Life is a crazy ride, and nothing is guaranteed."
    + " He who has a why to live can bear almost any how.",

    " Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment."
    + " Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.",

    "Be thankful for what you have; you'll end up having more. If you concentrate on what you don't have, you will never, ever have enough."
    + " I decided I can’t pay a person to rewind time, so I may as well get over it.",

    " It needs to be said and heard: it's OK to be who you are."
    + " I think it's great to be flawed. I am hugely flawed, and I like it this way. That's the fun of life. You fall, get up, make mistakes, learn from them, be human and be you.",

    " I'll never forget where I'm from. It's essential to remain humble and evolving."
    + " If you’re doing something outside of dominant culture, there’s not an easy place for you. You will have to do it yourself."
  ];
  
  return texts[Math.floor(Math.random()*texts.length)];

}