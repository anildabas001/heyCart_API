class ApiFeature {
    constructor(query, queryString) {
        console.log(queryString);
        this.query = query;
        this.queryString = queryString;
    }

    replaceValues (value) {
        let stringValue = JSON.stringify(value);  
        let convertedObj = {};
        let convertedValue = JSON.parse(stringValue.replace(/lt|gt|eq/g, (value) => {
            return `$${value}`;
        }));
        
        convertedValue = convertedValue.split('=');
        convertedObj[convertedValue[0]] = parseInt(convertedValue[1]);        
        console.log(convertedObj); 
        //isNaN(convertedValue)?Object.keys(convertedValue).forEach(element => convertedValue[element] = +convertedValue[element]): convertedValue = +convertedValue;
        return convertedObj;
    }

    filter() {
        const filterObj = {...this.queryString};  
        const filtersExclude = ['selectFields', 'sortBy', 'limit', 'page'];
        filtersExclude.map(filterValue => {delete filterObj[filterValue];});

        if(filterObj.categories && ! filterObj.subCategories && filterObj.categories.split(',').length > 1) {
            const categoryElements= filterObj.categories.split(',');
            filterObj.categories = {$in: categoryElements};
        }

        if(filterObj.brand && filterObj.brand.split(',').length >= 1) {
            const brandElements= filterObj.brand.split(',');
            filterObj.brand = {$in: brandElements};
        }

        if(filterObj.subCategories && filterObj.subCategories.split(',').length >= 1) {
            const subCategories= filterObj.subCategories.split(',');
            filterObj.categories = {$in: subCategories};
            delete filterObj.subCategories;
        }
           

        // if(filterObj.categories && filterObj.categories.split(',').length > 1) {
        //     const categoryElements= filterObj.categories.split(',').join(' ');
        //     filterObj.categories = categoryElements
        // }

        if(filterObj.search) {
            filterObj.name = { $regex: new RegExp(filterObj.search.toLowerCase(), "i") };
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

        if(filterObj.price) {   
            const priceObj = {...filterObj};              
            delete filterObj.price;
            filterObj['price.value'] = this.replaceValues(priceObj.price);  
        }

        if(filterObj.discount) {   
            var discountValues={};
            const discountObj = {...filterObj};              
            delete filterObj.discount;
            var discounts = discountObj.discount.split(',').map(discount => this.replaceValues(discount));
             discounts.forEach(discount => {
                 discountValues = {...discount, ...discountValues}
             });
            console.log('lo-----------', discounts)
            filterObj.discountPercentage= {...discountValues};  
        }

        console.log(filterObj);

        this.query = this.query.find(filterObj);

        return this;
    }

    select() {
        if(this.queryString.selectFields) {            
            let selectFields = this.queryString.selectFields;
            this.query = this.query.select(selectFields.split(',').join(' '));
        }

        return this;
    }

    sort() {
        if(this.queryString.sortBy) {            
            let sortBy = this.queryString.sortBy;
            this.query = this.query.sort(sortBy.split(',').join(' '));            
        }

        return this;
    }

    paginate() {
        if(!isNaN(this.queryString.page)) {
            const limit = !isNaN(this.queryString.limit) ?  Math.abs(parseInt(this.queryString.limit)) : 10;
            const page = Math.abs(parseInt(this.queryString.page));
            const skip = (page -1)*limit;
            this.query = this.query.skip(skip).limit(limit);
        }

        return this;
    }

    executeQuery() {
        return this.query;
    }
}

module.exports = ApiFeature;