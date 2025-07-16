how to install in Vue.JS
 

 npm install -g @vue/cli

 --version
 
 @vue/cli 5.08
 
  vue create hello-world 
  -Default ([Vue 3] babel,eslint)
  
  npm run serve 
  
  http://localhost:8080
  
  
---------------------------------------------------------------------------------
Part 5 - Binding text
<template>

<div>{{greet}} {{name}}</div> 
<div v-html="channel"></div>
<div v-text="channel"></div>



</template>
  
 

<script>
export default  {
name: "App",
data(){
   return {
      greet:"Hello",
      name:"Sakthivel Raju",
      channel:'<b>Codevolution</b> ',
      hack:`<a href="#" onclick="alert('You have been hacked')"> Win a Prize!</a>

`  
   }
 } 
 }
 
</script>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

-----------------------------------------------------------------------------------------
 Part 6 - Binding Html 
   <template>

<div>{{greet}} {{name}}</div> 
<div v-html="channel"></div>
//<div v-text="channel"></div>
<div v-html="hack">  </div>


</template>
  
 

<script>
export default  {
name: "App",
data(){
   return {
      greet:"Hello",
      name:"Sakthivel Raju",
      channel:'<b>Codevolution</b> ',
      hack:`<a href="#" onclick="alert('You have been hacked')"> Win a Prize!</a>

`  
   }
 } 
 }
 
</script>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

  
-----------------------------------------------------------------------------------------
Part -7 Binding to attribute

 <template>


<h2 v-bind:id="headingId" >Heading</h2>
<button v-bind:disabled="isDisabled">Bind</button>



</template>
  
 

<script>


export default  {
name: "App",
data(){
   return {
     headingID: 'heading',
     isDisabled: false
     //isDisabled: true

 
   }
 } 
 }
 
</script>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>


----------------------------------------------------------------------------------------- 
  Part -8 Binding class
  
   <template>


<h2 v-bind:id="headingId" >Heading</h2>
<button v-bind:disabled="isDisabled">Bind</button>
<h2 class="underline" >Underlined Text </h2>
<h2 class="underline" v-bind:class="status">Status</h2>
<h2 v-bind:class="isPromoted && 'promoted' " >Promoted Movies</h2>
<h2 v-bind:class="isSoldout ? 'sold-out':'new'">soldout? movie</h2>
<h2 v-bind:class="['new','promoted']">Newly promoted movie</h2>
<h2 v-bind:class="[isPromoted && 'promoted', isSoldout ? 'sold-out': 'new' ]">Array conditional movie</h2>
 <h2 v-bind:class="{promoted : isPromoted,
                    new: !isSoldout,
                    'sold-out' : isSoldout
 }">Object conditional movie</h2>

</template>
 

<script>


export default  {
name: "App",
data(){
   return {
     headingID: 'heading',
     isDisabled: false,
     status:'success',
    //  isPromoted: true
    isPromoted: true,
    isSoldout:true,
 
   }
 } 
 }
 
</script>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.underline {
  text-decoration: underline;
}

.promoted {
  font-style: italic;
}

.new{
 color:olivedrab;
}

.sold-out{
  color:red
}

</style>
-------------------------------------------------------------------------------------