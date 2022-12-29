class Worker {
  constructor(
    {
      handler
    }
  ) {
    this.handler = handler
    this.validator = null
    this.entity = null
    this.open = false
    this.loading = false
    this.error = false
    this.errorMessage = ""
    this.emit = null

  }

  handle() {
    if (!this.handler) {
      this.open = false
      this.loading = false
      return
    }
    if (this.validator) {
      this.validator.$touch()
      if (this.validator.$invalid) {
        return
      }
    }
    this.loading = true
    this.handler(this.entity).then(res => {
      this.loading = false
      this.open = false
      if (this.emit) this.emit("result", res)
    }).catch(error => {
      if (error.response && error.response.data) {
        this.errorMessage = error.response.data.message
      } else {
        this.errorMessage = "保存时出现了异常，暂时无法保存。"
      }
      this.error = true
      this.loading = false
    })
  }

  cancel() {
    this.open = false
    this.entity = null
    this.loading = false
    this.error = false
    this.errorMessage = ""
  }

}

export default Worker
