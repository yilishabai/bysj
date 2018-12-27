//优先级队列
var items = [];
var nowElement;
// {1}
function QueueElement(element, priority) {
  this.element = element;
  this.priority = priority;
}

var enqueue = function (element, priority) {
  var queueElement = new QueueElement(element, priority);

  if (this.isEmpty()) {
    items.push(queueElement);  // {2}
  } else {
    var added = false;
    for (var i = 0; i < items.length; i++) {
      if (queueElement.priority < items[i].priority) {
        items.splice(i, 0, queueElement);    // {3}
        added = true;
        break;
      }
    }
    if (!added) {    // {4}
      items.push(queueElement);
    }
  }
}
var dequeue = function () {
  return items.shift();
}

var front = function () {
  return items[0];
}

var isEmpty = function () {
  return items.length === 0;
}

var clear = function () {
  items = [];
}

var size = function () {
  return items.length;
}

var print = function () {
  console.log(items);
}

var create = function (words) {
  for (var word of words) {
    this.enqueue(word, 0);
  }
}

module.exports = {
  enqueue: enqueue,
  dequeue: dequeue,
  front: front,
  isEmpty: isEmpty,
  clear: clear,
  size: size,
  print: print,
  create: create,
  nowElement: nowElement,
}