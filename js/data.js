export const OPTIONS = {
  base: { title: 'เลือกรูปทรงกระทง', items: [
    ['fold','ใบตองจีบ','ลายพับคลาสสิก'], ['lotus','บัวหลวง','กลีบชมพูอ่อน'],
    ['woven','ใบตองสาน','ลายสานละเอียด'], ['banana','กาบกล้วย','ทรงใบยาว'],
    ['layers','กลีบบัวซ้อน','ซ้อนกลีบหลายชั้น'], ['spiral','ใบตองวน','ลายเวียนสลับ']
  ]},
  flower: { title: 'เลือกดอกไม้', items: [
    ['pink','บัวชมพู','หวานละมุน'], ['white','บัวขาว','งาช้าง'],
    ['marigold','ดาวเรือง','เหลืองสด'], ['orchid','กล้วยไม้','ม่วงอ่อน'],
    ['jasmine','มะลิ','ดอกสีขาว'], ['champa','จำปา','เหลืองทอง'],
    ['blue','บัวฟ้า','ฟ้าอมม่วง'], ['sunset','บัวส้ม','ส้มอรุณ']
  ]},
  trim: { title: 'เลือกสีขอบกระทง', items: [
    ['natural','เขียวใบตอง','โทนธรรมชาติ'], ['gold','ทองอ่อน','แสงอุ่น'],
    ['red','แดงชาด','สีมงคล'], ['indigo','คราม','น้ำเงินเข้ม'],
    ['ivory','งาช้าง','ขาวนวล'], ['copper','ทองแดง','อบอุ่นลึก']
  ]},
  light: { title: 'เลือกแสงเทียน', items: [
    ['one','เทียนหนึ่งเล่ม','เรียบง่าย'], ['two','เทียนคู่','สองแสง'],
    ['three','เทียนสามเล่ม','อบอุ่น'], ['incense','เทียนและธูป','แบบดั้งเดิม'],
    ['five','เทียนห้าเล่ม','แสงสว่างเต็มดวง']
  ]},
  decoration: { title: 'เลือกของประดับ', items: [
    ['simple','ธรรมชาติ','งานเรียบ'], ['beads','ประดับไข่มุก','มุกสีงาช้าง'],
    ['gold','เม็ดทอง','ประกายทอง'], ['garland','พวงมาลัย','ดอกไม้ร้อย'],
    ['ribbon','สายริบบิ้น','เส้นสีทอง'], ['dew','หยดน้ำค้าง','ประกายใส']
  ]}
};
export const PALETTE = {
  pink:['#fff4ed','#efa5bd','#b24e7a'], white:['#fffdf6','#e9e4d2','#b3b1a2'],
  marigold:['#fff1a3','#f5ba39','#b8761e'], orchid:['#f5e1fe','#bf8cd8','#86519c'],
  jasmine:['#fffef2','#e4e9cc','#9fae91'], champa:['#fff5bb','#f0ce6e','#b68a2b'],
  blue:['#eaf0ff','#b2bee9','#6e81b7'], sunset:['#fff0d4','#ec9c78','#ba635d']
};
export const TRIM = {
  natural:'#9fbd79',gold:'#dfb877',red:'#ad5b4a',indigo:'#7b8fb1',ivory:'#f3e5c7',copper:'#b88865'
};
export const DEFAULT_DESIGN={base:'fold',flower:'pink',trim:'natural',light:'one',decoration:'garland',density:9};
export function validateDesign(v){
 const out={...DEFAULT_DESIGN};
 if(v&&typeof v==='object'){
  for(const category of Object.keys(OPTIONS)){
   if(OPTIONS[category].items.some(([id])=>id===v[category]))out[category]=v[category];
  }
  if([6,9,13].includes(v.density))out.density=v.density;
 }
 return out;
}
export const SAMPLE_WISHES=[
 {message:'ขอให้คนที่รักมีสุขภาพแข็งแรง',design:{base:'lotus',flower:'white',trim:'gold',light:'one',decoration:'beads',density:9}},
 {message:'ขอให้สิ่งดี ๆ เดินทางเข้ามาในชีวิต',design:{base:'layers',flower:'orchid',trim:'ivory',light:'three',decoration:'dew',density:13}},
 {message:'ขอให้ครอบครัวมีรอยยิ้มในทุกวัน',design:{base:'woven',flower:'marigold',trim:'natural',light:'two',decoration:'gold',density:9}},
 {message:'ขอให้ความตั้งใจในปีนี้สำเร็จ',design:{base:'spiral',flower:'sunset',trim:'copper',light:'incense',decoration:'garland',density:6}},
 {message:'ขอให้ทุกคืนมีแสงแห่งความหวัง',design:{base:'banana',flower:'champa',trim:'red',light:'five',decoration:'ribbon',density:9}},
 {message:'ขอให้ทุกคนเจอความสบายใจ',design:{base:'fold',flower:'jasmine',trim:'indigo',light:'one',decoration:'simple',density:6}},
 {message:'ขอให้ความเมตตาอยู่กับผู้คนเสมอ',design:{base:'lotus',flower:'blue',trim:'gold',light:'two',decoration:'dew',density:13}},
 {message:'ขอให้โลกนี้อบอุ่นขึ้นอีกนิด',design:{base:'layers',flower:'pink',trim:'natural',light:'three',decoration:'beads',density:9}}
];
