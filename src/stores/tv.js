import { defineStore } from 'pinia'

export const useTvStore = defineStore('tv', {
  
  state: () => ({
    focusedIndex: 1,
    activeView: "Histo",
    inMenu: true
  }),

  actions: {
      right() {
        if (this.inMenu && this.focusedIndex<=2){
          this.focusedIndex++
          document.getElementById("Menu" + this.focusedIndex).focus()
        }
      },
      left() { 
        if (this.inMenu && this.focusedIndex>=2){
          this.focusedIndex--
          document.getElementById("Menu" + this.focusedIndex).focus()
        }
      },
      down() { 
        if (this.inMenu){
          this.focusedIndex=0
          document.getElementById(this.activeView + this.focusedIndex).focus()
          this.inMenu = false
        }
        else{
          this.focusedIndex++
          document.getElementById(this.activeView + this.focusedIndex).focus()
        } 
      },
      up() { 
        if (!this.inMenu && this.focusedIndex >= 1){
          this.focusedIndex--
          document.getElementById(this.activeView + this.focusedIndex).focus()
        }
      },
      click() {
        document.getElementById(this.activeView + this.focusedIndex).children[0].children[0].click()
      }
  }
})
