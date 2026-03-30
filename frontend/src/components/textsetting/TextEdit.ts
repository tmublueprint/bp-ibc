export { Update, stylingTypes, OFFVAL, renderStyledDivs }

class Update {
  idx: number;
  style: string;
  val: string | undefined | null;
  constructor(idx: number, style: string, val?: string) {
    this.idx = idx;
    this.style = style;
    this.val = val;
  }
}

const stylingTypes = ["bold", "italic", "underline", "strike", "fontFamily", "fontSize"]; // everything should depend on this
const OFFVAL = "0"; // constant because not sure if "0" or "-1" is better for off, needs to be a string to hold value (ex. bold 700)

function renderStyledDivs(text: string, updates: Update[]) {
  const state: Record<string, string> = {};
  for (let i = 0; i < stylingTypes.length; i++) state[stylingTypes[i]] = OFFVAL;

  const toStyleString = () => { // inline styling for now
    let styles = "";
    if(state.bold != OFFVAL) styles+='font-weight:'+state.bold+';';
    if(state.italic != OFFVAL) styles+='font-style:italic;';
    const decorations = [
      state.underline != OFFVAL ? 'underline' : '',
      state.strike != OFFVAL ? 'line-through' : '',
    ].filter(Boolean).join(' ');
    if(decorations) styles+=`text-decoration:${decorations};`;
    if(state.fontFamily != OFFVAL) styles+='font-family:'+state.fontFamily+';';
    if(state.fontSize != OFFVAL) styles+='font-size:'+state.fontSize+';';
    styles += 'white-space: pre-wrap';
    return styles;
  };

  let html = "";
  let curIdx = 0;
  for(let i = 0; i < updates.length; i++) {
    if(updates[i].idx != curIdx) {
      html += '<span style="'+toStyleString()+'">'+text.substring(curIdx, updates[i].idx)+'</span>';
      curIdx = updates[i].idx;
    }
    state[updates[i].style as keyof typeof state] = updates[i].val || OFFVAL; // the OFFVAL or null makes it off
  }
  html += '<span style="'+toStyleString()+'">'+text.substring(curIdx)+'</span>';
  return html;
}