<template>
<div class="">

<div class="column is-12">
	<label class="label" for="email">Email</label>
	<p :class="{ 'control': true }">
		<input v-validate data-vv-rules="required|email" :class="{'input': true, 'is-danger': errors.has('email') }" name="email" type="text" placeholder="Email">
		<span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
	</p>
	<MyComponent lorem="1" ipsum="2"/>
	<MyComponent
		lorem="1" ipsum="2"
	/>

	<MyComponent
		lorem="1" ipsum="2"
		dolor="3"
	/>
</div>

</div>
</template>

<script>
var d1={
a:1,
b:2
}

Vue.component('AsyncComponent', (resolve, reject) => {
  setTimeout(() => {
    // @vue/component
    resolve({
      "name": 'async-component',
      template: '<div></div>'
    })
  }, 500)
})

export default {
	"data": () => ({
	       a1: 0
	}),
	     methods: {
		fn1 () {
 
			h1 = 10
		}
	}
}
</script>
