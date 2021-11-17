const clkApp = Vue.createApp({

    template: 
    /*html*/
    `
    <label for="clkFile" class="file-label" :class="{ 'mb-2':isChanged }" >Please enter your PDF file</label>
    <input @change="getPdfData" type="file" name="clk" id="clkFile" class="input-file mb-2"><br>
    
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
                
                <div id="textarea" class="items">
                    <label for="instructions">Instructions</label><br>
                    <textarea name="instructions" id="instructions" class="mb-2" readonly>{{ originalTextArea }}</textarea>
                    <br>
                </div>

                <div id="input-textarea" class="items">

                    <textarea-input @text-changed="setTextArea"></textarea-input>

                </div>

                <div id="mod-textarea" class="items">

                    <label for="ins-mod">Custom Instructions</label><br>
                    <textarea name="ins-mod" id="ins-mod">{{ modifiedTextArea }}</textarea>
                    <br>

                </div>
            </div>
        </div>
    
    
    `,


    data(){
        return{
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

        getPdfData(event){

           
            // console.log('Changed', event.target.files[0]);

            let file = event.target.files[0];
            //Step 2: Read the file using file reader
            let fileReader = new FileReader();  
            
            
            
            fileReader.onload = async function() {

                //Step 4:turn array buffer into typed array
                let typedarray = new Uint8Array(this.result);
                
                // mountedApp.msg = pageContent.items[0]
                
                const doc = await pdfjsLib.getDocument(typedarray).promise // note the use of the property promise

                // Getting the first page of the file
                const page = await doc.getPage(1)
                
                // Setting the value of the page to String and assigning to a variable
                let pageContent = await page.getTextContent()

                //Variables to get pdf data
                let pdfLines = {}
                let startContent
                let endContent
                const indexCondition = [2,28,52,65,67]

                //Mapping through the pdf lines
                pageContent.items.forEach((item,index) => {

                    if(item.str !== ''){
                        // console.log(`Index: ${index}, Data: ${item.str}`)
                        
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
                mountedApp.originalTextArea = pdfLines['instructions'].toLowerCase()             

                // Set all the data from the pdf to the variable to print
                mountedApp.pdfData = { ...pdfLines };

                // Set to true if the input file has changed
                mountedApp.isChanged = true;

            
            };
    
            fileReader.readAsArrayBuffer(file);


            
        },


        setTextArea(text){
            this.modifiedTextArea = text;
        }
    },
    


})
