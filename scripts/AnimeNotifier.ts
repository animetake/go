import { Application } from "./Application"
import { findAll } from "./utils"
import * as actions from "./actions"

export class AnimeNotifier {
	app: Application

	constructor(app: Application) {
		this.app = app
	}

	onReadyStateChange() {
		if(document.readyState !== "interactive") {
			return
		}

		this.run()
	}

	run() {
		this.app.content = this.app.find("content")
		this.app.loading = this.app.find("loading")
		this.app.run()
	}

	loading(isLoading: boolean) {
		if(isLoading) {
			this.app.loading.classList.remove(this.app.fadeOutClass)
		} else {
			this.app.loading.classList.add(this.app.fadeOutClass)
		}
	}

	onContentLoaded() {
		this.updateMountables()
		this.updateAvatars()

		for(let element of findAll(".action")) {
			let actionName = element.dataset.action

			element.onclick = () => {
				actions[actionName](this, element)
			}
		}
	}

	onPopState(e: PopStateEvent) {
		if(e.state) {
			this.app.load(e.state, {
				addToHistory: false
			})
		} else if(this.app.currentPath !== this.app.originalPath) {
			this.app.load(this.app.originalPath, {
				addToHistory: false
			})
		}
	}

	onKeyDown(e: KeyboardEvent) {
		// Ctrl + Q = Search
		if(e.ctrlKey && e.keyCode == 81) {
			let search = this.app.find("search") as HTMLInputElement

			search.focus()
			search.select()

			e.preventDefault()
			e.stopPropagation()
		}
	}

	updateAvatars() {
		for(let element of findAll(".user-image")) {
			let img = element as HTMLImageElement

			if(img.naturalWidth === 0) {
				img.onload = function() {
					this.classList.add("user-image-found")
				}

				img.onerror = function() {
					this.classList.add("user-image-not-found")
				}
			} else {
				img.classList.add("user-image-found")
			}
		}
	}

	updateMountables() {
		const delay = 20
		const maxDelay = 1000
		
		let time = 0

		for(let element of findAll(".mountable")) {
			setTimeout(() => {
				window.requestAnimationFrame(() => element.classList.add("mounted"))
			}, time)

			time += delay

			if(time > maxDelay) {
				time = maxDelay
			}
		}
	}

	// onResize(e: UIEvent) {
	// 	let hasScrollbar = this.app.content.clientHeight === this.app.content.scrollHeight

	// 	if(hasScrollbar) {
	// 		this.app.content.classList.add("has-scrollbar")
	// 	} else {
	// 		this.app.content.classList.remove("has-scrollbar")
	// 	}
	// }
}