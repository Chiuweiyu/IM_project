const fs = require("fs");
const Mail = require("./Mail.js");

class Heap {
  _defaultComparator(a, b) {
    return a < b;
  }
  constructor(comparator, data = []) {
    this._items = data;
    this._size = this._items.length;
    this._comparator = (typeof comparator === 'function' ? comparator : this._defaultComparator);

    if(this._size != 0){
      for(let i = 0; i < data.length; i++) {
        this._items[i] = Object.create(Mail.prototype, Object.getOwnPropertyDescriptors(this._items[i]))
        this._items[i].container = this;
      }
      this.heapify();
    }
    
  }

  empty() {
     return this._size === 0;
   }

  pop() {
    if (this._size === 0){
      return;
    }
    try{this._items[0].StopCountdown();}  catch(err){};

    const elt = this._items[0];

    const lastElt = this._items.pop();
    this._size--;

    if (this._size > 0) {
      this._items[0] = lastElt;
      this._sinkDown(0);
    }

    return elt;
  }

  push(item) {
    this._items[this._size++] = item;
    this._bubbleUp(this._size - 1);
  }

  pushList(ListItem) {
    ListItem.forEach(item =>{
      this._items[this._size++] = item;
      this._bubbleUp(this._size - 1);
    });
  
  }

  find(user_id, draft_id){
    return this._items.findIndex(item => (item.user_id == user_id && item.draft_id == draft_id));
  }

  delete(user_id, draft_id) {
    let ind = this._items.findIndex(item => (item.user_id == user_id && item.draft_id == draft_id));
    if (ind == -1){
      throw new Error("Cannot find item.");
    }
    else{

      this._items.splice(ind, 1);
      this._size--;
      this.heapify();
    }
  }

  size() {
    return this._size;
  }


  peek() {
    if (this._size === 0) {
      return;
    }
    else{
      return this._items[0];
    }
  }

  item(ind){
    if (ind >= this._size) {
      return;
    }
    else{
      return this._items[ind];
    }
  }

  toJson(pathToFile){
    fs.writeFile(
      pathToFile, 
      JSON.stringify(this._items, (key,value) =>{
          if (key==="container") {
            return undefined;
          }
          else {
            return value;
          }
      }), 
      err => {
        if(err) throw new Error(err);
      }) ;
  }

  heapify() {
    for (let index = Math.floor((this._size + 1) / 2); index >= 0; index--) {
      this._sinkDown(index);
    }
  }


  _bubbleUp(index) {
    const elt = this._items[index];
    while (index > 0) {
      const parentIndex = Math.floor((index + 1) / 2) - 1;
      const parentElt = this._items[parentIndex];

      // if parentElt < elt, stop
      if (this._comparator(parentElt, elt)) {
        return;
      }

      // swap
      this._items[parentIndex] = elt;
      this._items[index] = parentElt;
      index = parentIndex;
    }
  }


  _sinkDown(index) {
    const elt = this._items[index];

    while (true) {
      const leftChildIndex = 2 * (index + 1) - 1;
      const rightChildIndex = 2 * (index + 1);
      let swapIndex = -1;

      if (leftChildIndex < this._size) {
        const leftChild = this._items[leftChildIndex];
        if (this._comparator(leftChild, elt)) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < this._size) {
        const rightChild = this._items[rightChildIndex];
        if (this._comparator(rightChild, elt)) {
          if (swapIndex === -1 ||
              this._comparator(rightChild, this._items[swapIndex])) {
            swapIndex = rightChildIndex;
          }
        }
      }

      // if we don't have a swap, stop
      if (swapIndex === -1) {
        return;
      }

      this._items[index] = this._items[swapIndex];
      this._items[swapIndex] = elt;
      index = swapIndex;
    }
  }
}

module.exports = Heap;