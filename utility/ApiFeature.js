class ApiFeature {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    replaceValues (value) {
        let stringValue = JSON.stringify(value);        
        let convertedValue = JSON.parse(stringValue.replace(/lt|gt|eq/g, (value) => {
            return `$${value}`;
        }));

        isNaN(convertedValue)?Object.keys(convertedValue).forEach(element => convertedValue[element] = +convertedValue[element]): convertedValue = +convertedValue;
        return convertedValue;
    }

    filter() {
        const filterObj = {...this.queryString};  
        const filtersExclude = ['select', 'sort', 'limit', 'skip'];
        filtersExclude.map(filterValue => {delete filterObj[filterValue];});

        if(filterObj.search) {
            filterObj.name = {$regex: filterObj.search};
            delete filterObj.search;
        }

        if(filterObj.ratingsAverage) {
            filterObj.ratingsAverage = this.replaceValues(filterObj.ratingsAverage);
        }

        if(filterObj.price) {   
            const priceObj = {...filterObj};              
            delete filterObj.price;
            filterObj['price.value'] = this.replaceValues(priceObj.price);  
        }

        console.log(filterObj);
              
        this.query = this.query.find(filterObj);

        return this.query;
    }

    selectFields() {

    }

    sort() {
        price, popularity, alphabetical, discount
    }

    paginate() {

    }
}

module.exports = ApiFeature;