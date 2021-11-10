clkApp.component('textarea-input',{


    props:
     {
        'id': String,
        'title':String,
        // ['id','title','customValue'],
    },
    
    template: 
    /*html*/
    // adjuster,phone,email,claim,other
    `
    <div class="mb-2">

        <!-- Adjuster -->
        <label for="adjuster">Adjuster</label><br>
        <input class="custom" 
        id="adjuster" 
        v-model="adjuster"
        @change="getInputData(id)"
        ><br>

        <!-- Phone Number -->
        <label for="phone">Phone #</label><br>
        <input class="custom" 
        id="phone" 
        v-model="phone"
        @change="getInputData(id)"
        ><br>

        <!-- Email -->
        <label for="email">Email</label><br>
        <input class="custom" 
        id="email" 
        v-model="email"
        @change="getInputData(id)"
        ><br>

        <!-- Claim -->
        <label for="claim">claim #</label><br>
        <input class="custom" 
        id="claim" 
        v-model="claim"
        @change="getInputData(id)"
        ><br>

        <!-- Other -->
        <label for="other">Other</label><br>
        <input class="custom" 
        id="other" 
        v-model="other"
        @change="getInputData(id)"
        ><br>
    </div>
    `,


    data() {
        return {
            adjuster: '',
            phone: '',
            email: '',
            claim: '',
            other: '',

            baseText:'',
        }
    },

    methods: {
        getInputData(id){
            let adjuster = this.adjuster
            let phone = this.phone
            let email = this.email
            let claim = this.claim
            let other = this.other

            if(this.modelValue !== ''){

                if(adjuster !== ''){ adjuster } else {adjuster = ''}
                
                if(email !== ''){ email = `Email: ${email} ` } else {email = ''}
                
                if(phone !== ''){ phone = `Phone: ${phone} ` } else {phone = ''}

                if(claim !== ''){ claim = `Claim: ${claim} ` } else {claim = ''}

                if(other == ''){
                    other = '' 
                }

                let modifiedText = `***RUSH*** THIS IS A REVERSE MORTGAGE. SET UP A DATE AND TIME TO MEET AND PROVIDE ACCESS TO FIELD ADJUSTER: ${adjuster.trim()} ${email}${phone}${claim}${other} IT IS REQUIRED THAT YOU AND THE VISITOR FILL OUT THE ATTACHED SPECIAL APPOINTMENT FORM AND UPLOAD WITH RESULTS. PLEASE TAKE PHOTOS OF: Address photo, Photo of the property being open for the adjuster. Photo of the adjuster and a photo of his ID or business card if possible. Photo of inside the entry of property Photo of property being secured/closed back up. Please only use pages 1-3 of the work order, the rest of the pages after that can be disregarded.`
                // console.log(modifiedText);
                this.$emit('text-changed', modifiedText)
                // this.$emit('model-data',this.modelValue)
            }
        }
    }



})