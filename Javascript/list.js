class Item {
  next = null
  value = null
  constructor(value) {
    this.value = value
  }
}
class LinkedList {
  #head = null
  #tail = null
  append = (value) => {
    const item = new Item(value)
    if (!this.#head) {
      this.#head = item
      this.#tail = item
      return
    }
    this.#tail.next = item
    this.#tail = item
  }
  size = () => {
    let count = 1
    let item = this.#head
    if (!item) return 0
    while ((item = item.next)) {
      count++
    }
    return count
  }
}