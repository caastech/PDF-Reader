const clkApp = Vue.createApp({

    template: 
    /*html*/
    `   
        {{ pdfData }}
        <br>
        
        <custom-input @get-data="getContent" id="clkFile" type="file" title="Please enter your PDF file" 
        :handler="true" 
        ></custom-input>

        <custom-input v-for="(field,key) in fields" 
        :key="key" 
        :id="field.id"
        :type="field.type"
        :title="field.title"
        :customValue="pdfData[field.id]"
        ></custom-input>


    `,

    data(){
        return{
            fields: [
                { id:'dueDate', type:'text', title:'Due Date'},
                { id:'clientPay', type:'text', title:'Client Pay'},
                { id:'clientPay', type:'text', title:'Client Pay'},
            ],
            pdfData: [],
            msg: 'Here I am'
        }
    },

    methods: {
        getContent(pdf){
            this.pdfData = {
                ...pdf
            }
            console.log('PDF Data:');
        }
    },
    


})
