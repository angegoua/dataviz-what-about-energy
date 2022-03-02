export default class DataDisplay {
    constructor(_) {
        this.dataBlock = document.body.querySelector('#data-block')
        this.countryText = document.body.querySelector('#country-data')
        this.productionText = document.body.querySelector('#production-data')
        this.consumptionText = document.body.querySelector('#consumption-data')
        this.dataDisplayed = false
    }

    setData(_newData) {
        if (_newData) {
            if (!this.dataDisplayed) {
                this.dataBlock.classList.add('display')
                this.dataDisplayed = true
            }

            this.countryText.textContent = _newData.country
            this.productionText.textContent = _newData.production.toFixed(5)
            this.consumptionText.textContent = _newData.consumption.toFixed(5)
        }
    }
}
