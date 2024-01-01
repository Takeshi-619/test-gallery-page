export default class GlElments {
  targetElArray: HTMLElement[];
  optionList: {
    width: number;
    height: number;
    top: number;
    left: number;
    img: string;
  }[];

  constructor(targetElArray: HTMLElement[]) {
    this.targetElArray = targetElArray;
    this.optionList = [];
  }

  init() {
    this._initOptionList();
  }

  _initOptionList() {
    for (let i = 0; i < this.targetElArray.length; i++) {
      const target = this.targetElArray[i];
      const rect = target.getBoundingClientRect();
      // console.log(target);

      this.optionList[i] = { width: 0, height: 0, top: 0, left: 0, img: "" };
      this.optionList[i].width = rect.width;
      this.optionList[i].height = rect.height;
      this.optionList[i].top = rect.top;
      this.optionList[i].left = rect.left;

      const imagePath = target.querySelector("img")?.src;
      this.optionList[i].img = imagePath || "";
    }
  }

  _updateOptionList() {
    for (let i = 0; i < this.targetElArray.length; i++) {
      const rect = this.targetElArray[i].getBoundingClientRect();

      this.optionList[i].width = rect.width;
      this.optionList[i].height = rect.height;
      this.optionList[i].top = rect.top;
      this.optionList[i].left = rect.left;
    }
  }
}
