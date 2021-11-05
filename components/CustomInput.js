clkApp.component('custom-input',{


    props: {
        'id': String,
        'type':String,
        'title':String,
        'customValue':String,
        'handler':Boolean, 
    },
    
    template: 
    /*html*/
    `
        <label :for="id">{{ title }} - {{ customValue }}</label><br>
        <input v-if="handler" class="custom" 
        @change="getContent" 
        :id="id" 
        :type="type"
        :value="customValue"
        >
        <input v-else class="custom" :id="id" :type="type" >
        <br>
    `,


    data() {
        return {
        }
    },

    methods: {
        async getContent(event){
            console.log('Changed', event.target.files[0].name);
            
            // Getting the pdf file pages as a promise
            const doc = await pdfjsLib.getDocument(`special/${event.target.files[0].name}`).promise // note the use of the property promise

            // Getting the first page of the file
            const page = await doc.getPage(1)
            
            // Setting the value of the page to String and assigning to a variable
            let pageContent = await page.getTextContent()

            let pdfLines = {}
            let insIndex
            let startIndex
            const indexCondition = [2,28,52,65,67]
            
            //Mapping through the pdf lines
            pageContent.items.map((item,index) => {

                if(item.str !== ''){
                    console.log(`Index: ${index}, Data: ${item.str}`)
                    
                    // Setting indexes for the instructions for
                    if(item.str == 'Code:'){
                        startIndex = index
                        insIndex = index + 14
                    }

                    //Pushing to the array if the index is correct
                    if(indexCondition.includes(index)){

                        switch (index) {
                            case 2:
                                pdfLines['orderNumber'] = item.str
                                break;
                            case 28:
                                pdfLines['dueDate'] = item.str.slice(10,20)
                                break;

                            case 52:
                                pdfLines['lender'] = item.str
                                break;

                            case 65:
                                pdfLines['address'] = item.str
                            break;

                            case 67:
                                let citySlice= item.str.split(',')
    
                                console.log(citySlice);
                                // citySlice.pop()
                            
                                citySlice[1].split(' ').map(
                                    word =>{
                                        if(word !== ''){
                                            // console.log('Second: ',word)
                                            citySlice.push(word)
                                        }
                            
                                    }
                                )

                                // fixing Formating on Array
                                citySlice.splice(1,1)
                                // console.log(citySlice);
                                
                                // Adding the manual ids for the objects
                                let manualId = ['city','state','zipCode']
                                
                                citySlice.map(
                                    (word,index) => {
                                        if(word !== ''){
                                            pdfLines[manualId[index]] = word
                                        }
                                    }
                                )
                                
                                console.log(pdfLines);    
                            
                                // pdfLines.push({id:'lender',value: item.str})

                            break;

                            default:
                                break;
                        }
                        
                        
                    }
                }
            })

            
            this.$emit('get-data', pdfLines)
            // this.inputData = pdfLines;

        }
    },



})