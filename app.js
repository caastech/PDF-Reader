const clkApp = Vue.createApp({

    template: 
    /*html*/
    `
    <label for="clkFile">Please enter your PDF file</label><br>
    <input @change="getPdfData" type="file" name="clk" id="clkFile" class="mb-2"><br>
    
    <div v-if="isChanged" class="container">

            <div class="details">
                <custom-input v-for="(field,key) in fields" 
                :key="key" 
                :id="field.id"
                :title="field.title"
                :customValue="pdfData[field.id]"
                ></custom-input>
            </div>
            
            <div class="instructions">

                <label for="instructions">Instructions</label><br>
                <textarea name="" id="instructions" class="mb-2" cols="90" rows="8" readonly>{{ originalTextArea }}</textarea>
                <br>
                
                <textarea-input @text-changed="setTextArea"></textarea-input>

                <label for="ins-mod">Custom Instructions</label><br>
                <textarea name="" id="ins-mod" cols="90" rows="8" readonly>{{ modifiedTextArea }}</textarea>
                <br>
            </div>
        </div>
    
    
    `,


    data(){
        return{
            // msg: 'Here I am',
            fields: [
                { id:'dueDate', type:'text', title:'Due Date'},
                { id:'clientPay', type:'text', title:'Client Pay'},
                { id:'lender', type:'text', title:'Lender'},
                { id:'workCode', type:'text', title:'Work Code'},
                { id:'orderNumber', type:'text', title:"Loan #/Client's Order #"},
                { id:'address', type:'text', title:"Address"},
                { id:'city', type:'text', title:"City"},
                { id:'state', type:'text', title:"State"},
                { id:'zip', type:'text', title:"Zip"},
            ],
            pdfData: [],
            isChanged: false,
            originalTextArea: '',
            modifiedTextArea: '',
        }
    },

    methods: {

        async getPdfData(event){
            console.log('Changed', event.target.files[0].name);
            
            // Getting the pdf file pages as a promise
            const doc = await pdfjsLib.getDocument(`special/${event.target.files[0].name}`).promise // note the use of the property promise

            // Getting the first page of the file
            const page = await doc.getPage(1)
            
            // Setting the value of the page to String and assigning to a variable
            let pageContent = await page.getTextContent()

            let pdfLines = {}
            let startContent
            let endContent
            const indexCondition = [2,28,52,65,67]
            
            //Mapping through the pdf lines
            pageContent.items.map((item,index) => {

                if(item.str !== ''){
                    console.log(`Index: ${index}, Data: ${item.str}`)
                    
                    // Setting indexes to get instructions data
                    if(item.str == 'Code:'){

                        startContent = index + 1
                        endContent = index + 14

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
    
                                // console.log('City Splite 1',citySlice);
                            
                                citySlice[1].split(' ').map(
                                    word =>{
                                        if(word !== ''){
                                            // console.log('Second: ',word)
                                            citySlice.push(word)
                                        }
                            
                                    }
                                )

                                // Fix Formatting on Array
                                citySlice.splice(1,1)
                                // console.log('City Split 2',citySlice);
                                
                                // Add the manual ids for the objects
                                let manualId = ['city','state','zip']
                                
                                citySlice.map(
                                    (word,index) => {
                                        if(word !== ''){
                                            pdfLines[manualId[index]] = word
                                        }
                                    }
                                )
                                
                            break;

                            
                        }
                        
                        // Set the value of clientPay depending on the State
                        switch (pdfLines['state']) {
                            case 'NY':
                                pdfLines['clientPay'] = '18.00';
                                break;

                            case 'HI':
                                pdfLines['clientPay'] = '25.00';
                                break;
            
                            case 'MI':
                                pdfLines['clientPay'] = '25.00';
                                break;
            
                            case 'PR':
                                pdfLines['clientPay'] = '25.00';
                                break;
                                    
                            default:
                                pdfLines['clientPay'] = '0.00';
                                break;

                        }

                        // Set Workcode Value (A static value for now)
                        pdfLines['workCode'] = 'RUSH SPECIAL APPOINTMENT ORDER';
                        
                    }
                }
            })

            pdfLines['instructions'] = ''
            // For loop to set the instructions content
            for (let line = startContent ; line <= endContent; line++) {
                
                if(pageContent.items[line].str !== ''){
                    
                    
                    console.log('Instructions Data:',pageContent.items[line].str)
                    pdfLines['instructions'] += `${pageContent.items[line].str} \n`

                }
                
            }

            // Set original instructions to lower case and assign it to the variable to print
            this.originalTextArea = pdfLines['instructions'].toLowerCase()             

            // Set all the data from the pdf to the variable to print
            this.pdfData = { ...pdfLines };

            // Set to true if the input file has changed
            this.isChanged = true;
        },

        setTextArea(text){
            this.modifiedTextArea = text;
        }
    },
    


})
