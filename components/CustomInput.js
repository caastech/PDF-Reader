clkApp.component('custom-input',{


    props:
     {
        'id': String,
        'title':String,
        'customValue':String,
        // ['id','title','customValue'],
    },
    
    template: 
    /*html*/
    `
        <label :for="id">{{ title }} - {{ customValue }}</label><br>
        <input class="custom" 
        :id="id" 
        :value="customValue"
        readonly><br>

    `,


    data() {
        return {
            inputData: ''
        }
    },



})