<style>
  .table td {
    padding: 5px;
  }

  .dashed-line {
    border-top: 1px dashed #D3DCE6;
    height: 0;
    margin: 30px 0;
  }

  .product-edit_upload .el-form-item__content{
    line-height: inherit;
  }
  .product-edit_form .form-control{
    max-width: 900px;
  }

</style>

<template>
  <Wrap :back="true" :title="hasId ? '编辑' : '新增'">
		<p v-show="formStep==='loading'" slot="content">加载中……</p>
		<p v-show="formStep==='error'" slot="content">加载数据失败...{{errorMessage}}</p>
		
    <el-form v-show="/ready|submit_success|submit_error/.test(formStep)" slot="content" :model="formData" :rules="formDataRules" ref="formData" label-width="130px">
      <div class="form-body product-edit_form">
        <el-form-item label="名称：" prop="title" class="form-control">
          <el-input placeholder="请输入文本" v-model="formData.title"></el-input>
        </el-form-item>
				
        <el-form-item label="类别：" prop="category" class="form-control">
          <el-select v-model="formData.categories" multiple placeholder="请选择" >
            <el-option v-for="(value, key) in categoryOption" :key="key" :label="value" :value="key" ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="产品介绍图片：" prop="pics">
          <UploadBanner :formData="formData"/>
        </el-form-item>

        <el-form-item label="商品图片：" prop="thumb" class="product-edit_upload">
          <UploadThumb :formData="formData"/>
        </el-form-item>

        <el-form-item label="概述：" prop="brief" class="form-control">
          <el-input placeholder="请输入文本" v-model="formData.brief"></el-input>
        </el-form-item>

        <el-form-item label="图文详情：" prop="detail" class="form-control">
          <div id="editorContainer">
            <div id="j_editor"></div>
          </div>
        </el-form-item>

        <hr class="dashed-line"/>

        <el-form-item label="商品类型：" prop="type" class="form-control">
          <el-select v-model.string="formData.type">
            <el-option v-for="(val,key) in productTypeMap" :key="key" :label="val" :value="key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品规格：" v-if="formData.type==='0'" prop="stockMain" class="form-control">
          <Spec :stockMain="stockMain" :formData="formData"/>
        </el-form-item>

        <el-form-item label="商品库存：" v-if="formData.type==='0' && stockMain.table.length>0" prop="stockMainTable">
          <table cellspacing="0" cellpadding="0" border="0" class="table">
            <thead>
            <tr>
              <th colspan="1" rowspan="1" v-for="(td1,k1) in stockMain.tableFields">{{td1.name}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(td2,k2) in stockMain.table" :key="k2">
              <td v-for="(td3,k3) in stockMain.tableFields" :key="k3">
                <div class="pd010">
                  <el-input v-if="/price|stock|code/.test(td3.field)" style="width:50px;"
                            v-model.number="td2[td3.field]"></el-input>
                  <b v-else>{{td2[td3.field]}}</b>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </el-form-item>

        <el-form-item label="总库存：" prop="stock" class="form-control">
          <b v-if="formData.type==='0'">{{stock_readOnly}}</b>
          <el-input v-else placeholder="请输入整数" v-model.number="stock"></el-input>
        </el-form-item>

        <hr class="dashed-line"/>

        <el-form-item label="价格：" prop="price" class="form-control">
          <el-input placeholder="请输入金额" v-model="formData.price"></el-input>
        </el-form-item>

        <el-form-item label="是否丁当抵扣：" prop="scoreType" class="form-control">
          <el-select v-model="formData.scoreType">
            <el-option v-for="(val,key) in scoreTypeMap" :key="key" :label="val" :value="key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="parseInt(formData.scoreType)>0" label-position="right" prop="scoreValue" class="form-control">
          <el-input v-model.number="formData.scoreValue"
						:placeholder="'请输入抵扣的'+(formData.scoreType==='1'?'上限':'下限')"></el-input>
        </el-form-item>

        <el-form-item label="是否限购：" prop="limitPerUserType" class="form-control">
          <el-select v-model="localData.limitPerUserType">
            <el-option v-for="(val,key) in booleanMap" :key="key" :label="val" :value="key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="localData.limitPerUserType==='1'" prop="limitPerUser" class="form-control">
          <el-input  v-model="formData.limitPerUser"
                    placeholder="请输入限购数值"></el-input>
        </el-form-item>

        <el-form-item label="状态：" prop="status" class="form-control">
          <el-select v-model="formData.status">
            <el-option v-for="(val,key) in productStatusMap" :key="key" v-if="parseInt(key)<2" :label="val" :value="key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品标签" prop="tags">
          <el-checkbox-group v-model="formData.tags">
            <el-checkbox v-for="(val,key) in productTagMap" :key="key" :label="key">{{val}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>

      <div class="form-footer">
        <el-button size="small" type="primary" @click="onSubmit('formData')">保存内容</el-button>

      </div>

    </el-form>
  </Wrap>
</template>

<script>
  import {mapState} from 'vuex'
  import Wrap from '../wrap.vue'
  import Spec from './product_edit_spec.vue'
  import UploadThumb from './product_edit_upload_thumb.vue'
  import UploadBanner from './product_edit_upload_banner.vue'
  import store from 'store'
  import {A_FORM_SUBMIT_REQUEST, A_FORM_RESET} from 'store/management_product/types'
	import { ueditorReady } from 'utils/ueditor_tools'

  export default {
    data() {
      return {
				status_detailInit:false,
				tid1:0,
        hasId: !!this.$route.query.id,
        // 可输入的库存数
        stock: '',
        stock_readOnly: 0,
        localData: {
          pageStatus:'',
					limitPerUserType: '0',
					
        },
        ueObj: null,
        // 规格与库存
        stockMain: {
          // 表头字段
          tableFields: [
            // {field: 'price', name: '价格'},
            {field: 'stock', name: '库存'},
            // {field:"code", name:"商家编码"},
            {field: 'sold', name: '销量'}
          ],
          // 表体数据
          table: [
            /* {
             price: 0,
             stock: 0,
             code: "",
             sold: 0
             } */
          ],
          // 规格和库存（结构化数据）
          specs: [
            /* {
             id:1,
             name:"颜色",
             t_itName:"",
             requireUpload:false,
             items: [
             {id:1,name:"红色",cateid:1},
             {id:2,name:"黄色",cateid:1},
             ]
             },
             {
             id:2,
             name:"尺寸",
             t_itName:"",
             requireUpload:true,
             items: [
             {id:5,name:"大",cateid:2},
             {id:6,name:"中",cateid:2},
             {id:7,name:"小",cateid:2},
             {id:8,name:"小sdfsd士大夫撒旦法",cateid:2},
             {id:15,name:"大",cateid:2},
             {id:16,name:"中",cateid:2},
             {id:17,name:"小",cateid:2},
             {id:18,name:"小sdfsd士大夫撒旦法",cateid:2}
             ]
             } */
          ],
          specItems: {
            // "1":{...}
          }
        },
        /*
         formData: {

         }
         */
        formDataRules: {
          brief: [
            {required: true, message: '请输入概述', trigger: 'change'},
            // {max: 10, message: '字数不超过 10 个', trigger: 'blur'}
          ],
          title: [
            {required: true, message: '请输入名称', trigger: 'change'}
          ],
          detail: [
            {required: true, message: '请输入商品详情介绍', trigger: 'change'}
          ],
          price: [
            {required: true, validator: this.checkPrice, trigger: 'change'}
          ],
          scoreType: [
            {required: true, message: '请选择是否抵扣丁当', trigger: 'change'}
          ],
          scoreValue: [
            {required: true, validator: this.checkScoreValue, trigger: 'blur'}
          ],
          limitPerUserType: [
            {required: true, validator: this.checkLimitPerUserType, trigger: 'change'}
          ],
          limitPerUser: [
            {required: true, validator: this.checkLimitPerUser, trigger: 'blur'}
          ],
          status: [
            {required: true, message: '请选择商品状态', trigger: 'change'}
          ],
          type: [
            {required: true, message: '请选择商品类型', trigger: 'change'}
          ],
          stockMain: [
            {required: true, validator: this.checkStockMain, trigger: 'blur'}
          ],
          stock: [
            {required: true, validator: this.checkStock, trigger: 'blur,change'}
          ],
          pics: [
            {required: true, validator: this.checkPics, trigger: 'blur,change'}
          ],
          thumb: [
            {required: true, validator: this.checkThumb, trigger: 'blur,change'}
          ],
          tags: [
            {validator: this.checkTags, trigger: 'blur'}
          ],
          category: [
            {required: true, validator: this.checkCategory, trigger: 'blur,change'}
          ]
        }
      }
    },
    computed: {
      ...mapState({
        booleanMap: state => state.selectMap.booleanMap,
        productStatusMap: state => state.selectMap.productStatusMap,
        scoreTypeMap: state => state.selectMap.scoreTypeMap,
        productTagMap: state => state.selectMap.productTagMap,
        productTypeMap: state => state.selectMap.productTypeMap,
        categoryOption: state => state.selectMap.categoryMap,
				
        formStep: state => state.managementProduct.formStep,
        formData: state => state.managementProduct.formData,
        errorMessage: state => state.managementProduct.errorMessage
      })
    },
    methods: {
			validateField(name, force){
				if(this.localData.pageStatus === 'validate' || force){
					this.$refs.formData.validateField(name);
				}
				
			},
      onSubmit(formName) {
        // console.log( this.formData );
        // console.warn('获取表单数据')
        let rlt = {}
        // 常规数据
        for (var key in this.formData) {
          let tval

          if (/pics|tags/.test(key)) {
            tval = this.formData[key].join(',')
						
					} else if (/price/.test(key)) {
						// console.debug( this.formData[key], typeof this.formData[key] );
						tval = parseFloat(this.formData[key]) * 100;
						
          } else if (/specs/.test(key)) {
            tval = JSON.stringify(this.stockMain.specs)
						
          } else if (/skuList/.test(key)) {
						
						// 新增需删除 sku 项内 id
						let rlt1 = [];
						this.stockMain.table.map((el,i)=>{
							let t1 = Object.assign({},el);
							
							rlt1.push(t1);
							
						});
						console.debug( 'skuList', rlt1 );
            tval = JSON.stringify(rlt1);
						
          } else if (/detail/.test(key)) {
            tval = this.ueObj.getContent()
            // tval = "默认图文内容!!!";
						
          } else if (/categories/.test(key)) {
            tval = this.formData[key].join(',')
						
          } else {
            tval = this.formData[key]
						
          }
          rlt[key] = tval
          
        }
				
				// console.debug(key, tval)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // console.log('成功提交的数组', rlt)
            // 提交数据
            store.dispatch(A_FORM_SUBMIT_REQUEST, rlt)
            // this.onBack();
						
          } else {
					console.log('error submit!!')
						this.$message({
							type: 'error',
							message: '请检查表单输入!'
						});
            return false
          }
        })
				
				this.localData.pageStatus = 'validate';
      },
      initStockMain() {
        // 初始 规格与库存 数据，即将 state.formData 的相关数据导入到 本地 stockMain 内
        // console.debug('product.edit.initStockMain', this.formData.specs.length )
        let fd = this.formData
        let itemsPID = {}, itemsObj = {}
				
        if (fd.specs.length) {
          fd.specs.map((el, i) => {
            el.t_itName = ''
            this.stockMain.tableFields.unshift({'field': 'f' + el.id, 'name': el.name})
						
            if (el.items) {
              el.items.map((m, j) => {
								
								console.debug(m);
                itemsPID[m.id] = el.id
                itemsObj[m.id] = m
              })
            }

            if (!el.hasOwnProperty('requireUpload')) {
              el.requireUpload = false
            }
            // console.debug(1, el.requireUpload );
          })
					
					// 继承给子组件
          this.stockMain.specs = fd.specs
          this.stockMain.specItems = itemsObj
        }
				
        // console.log( "itemsPID", itemsPID );
        if (fd.skuList.length) {
          fd.skuList.map((el, i) => {
            // console.debug(1,el.specValueIds,el.specItemValues);
            let ids = el.specValueIds.split(','), vals = el.specItemValues.split(',')
            if (ids.length) {
              for (var j = 0; j < ids.length; j++) {
                // console.debug('-', j, ids[j], vals[j], el);
                el['f' + itemsPID[ids[j]]] = vals[j]
              }
            }
          })
					
					// 本组件中 sku table数据
          console.debug( "stockMain.table", fd.skuList );
          this.stockMain.table = fd.skuList
        }
      },
			detailInit(){
				let detail = this.formData.detail;
				// console.debug( !this.status_detailInit , detail!='',  this.hasId , this.ueObj )
				
				if( !this.status_detailInit && detail!='' && this.hasId && this.ueObj ){
					this.ueObj.setContent( this.formData.detail )
					this.status_detailInit = true;
				}
				
			},
			ueditorInit(){
				
				var se = this;
				
				const ue = se.ueObj = window.UE.getEditor('j_editor', {
					toolbars: [[
						'fullscreen', 'source',
						'|', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'blockquote', 'pasteplain',
						'|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist',
						'|', 'rowspacingtop', 'rowspacingbottom', 'lineheight',
						'|', 'customstyle', 'paragraph', 'fontfamily', 'fontsize',
						'|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify',
						'|', 'link', 'unlink',
						'|', 'simpleupload',
						'|', 'horizontal', 'date', 'time', 'spechars'
					]]
				})
				
				ue.ready(function() {
					se.detailInit()
				})
				
				ue.addListener('contentChange',function(){
					// console.log("ueditor.contentChange",se);
					se.formData.detail = ue.getContent();
					
					// 校验表单的字段
					se.validateField("detail");
					
				});
				
			},
      initUeditor() {
        // 规格与库存
				ueditorReady( this.ueditorInit );
				
      },
      initLocalData() {
        // 规格与库存
        this.initStockMain()
				
				// console.debug(  this.formData.limitPerUser )
				
        // 是否限购
        if (this.formData.limitPerUser) {
          this.localData.limitPerUserType = '1'
        }
				
				// 设置总存库数
				this.stock = this.formData.stock;
				
      },
      checkPrice(rule, value, callback) {
				console.debug('checkPrice', this.formData.price, parseFloat(value), value)
        if ( value === '' || parseFloat(value) <= 0  ) {
          return callback( new Error('请检查商品价格') )
        }
        callback()
      },
			checkScoreValue(rule, value, callback) {
        if (parseInt(this.formData.scoreType) > 0 && value === '') {
          return callback(new Error('请输入抵扣的' + (this.formData.scoreType === '1' ? '上限' : '下限')))
        }
        callback()
      },
      checkLimitPerUserType(rule, value, callback) {
        if (this.localData.limitPerUserType === '') {
          return callback(new Error('请选择是否限购'))
        }
        callback()
      },
      checkLimitPerUser(rule, value, callback) {
        if (this.localData.limitPerUserType === '1' && value === '') {
          return callback(new Error('请输入限购的数值'))
        }
        callback()
      },
      checkStockMain(rule, value, callback) {
        // console.log('checkStockMain', value, this.stockMain.specs.length, this)
				
        if (this.stockMain.specs.length === 0) {
          return callback(new Error('请填写商品规格'))
        }
				
				let rlts = 0;
				for(let key in this.stockMain.specs){
					let item = this.stockMain.specs[key];
					// console.debug( item, item.items.length );
          if (item.items.length === 0) {
            callback(new Error(item.name + '未添加单项'));
						rlts++;
            break;
          }
				}
				
				
        if (!rlts) {
          return callback()
        }
				
      },
      checkStock(rule, value, callback) {
        if ( parseInt( this.formData.type ) !== 0 && value === '') {
          return callback(new Error('请输入总库存'))
        }
        if ( !Number.isInteger(value) ) {
          return callback(new Error('请输入数字'))
        }
        callback()
      },
      checkPics(rule, value, callback) {
				console.log("checkPics");
        if (this.formData.pics.length === 0) {
          return callback(new Error('请添加商品介绍图片'))
        }
        if (this.formData.pics.length > 4) {
          return callback(new Error('商品介绍图片不得大于 4 张'))
        }
        callback()
      },
      checkThumb(rule, value, callback) {
        if (this.formData.thumb === '') {
          return callback(new Error('请添加商品图片'))
        }
        callback()
      },
      checkTags(rule, value, callback) {
        if (this.formData.tags.length > 3) {
          return callback(new Error('商品标签不能超过 3 个'))
        }
        callback()
      },
      checkStockMainTable(rule, value, callback) {
        this.stockMain.table.filter(item => {
          if (item.price === '') {
            callback(new Error('请检查各项价格是否填写完整'))
            return true
          } else if (item.stock === '') {
            callback(new Error('请检查各项库存是否填写完整'))
            return true
          } else {
            callback()
            return true
          }
        })
      },
			checkCategory(rule, value, callback) {
				// console.log('ds', this.formData.categories.length)
				if (!this.formData.categories.length) {
					return callback(new Error('请选择类别'))
				}
				return callback()
			}
			
    },
    components: {
      Wrap,
      Spec,
      UploadBanner,
      UploadThumb
    },
    watch: {
      formData: function(val, old) {
        console.debug('watch.edit.formData', val, val.specs.length )
        this.initLocalData()
      },
			formStep:function(val,old){
				console.debug('watch.formStep', val, old )
				
				if( val === "submit_success" ){
					this.$message({
						type: 'success',
						message: '产品添加成功'
					});
					
					// return;
					this.GM_routerPush({
						path: '../product'
					})
					
				}
				
				if( val ==="submit_error" ){
					this.$message({
						type: 'error',
						message: this.errorMessage
					});
				}
				
			}
			// 无效
			/* stockMain:function(val,old){
				console.debug("watch.stockMain");
			} */
    },
    beforeCreate() {
      console.warn("beforeCreate",1,this);
			
    },
    created() {
      console.warn("created",1);
      this.initLocalData()
    },
    beforeMount() {
      console.warn("beforeMount",1)
			
    },
    mounted() {
      console.warn("mounted",1)
			this.initUeditor();
			
			this.$watch( 'formData.detail', function(val,old){
				console.info("watch.formData.detail",val,old);
				this.detailInit();
			})
			
			// 产品介绍图片
			this.$watch( 'formData.pics', function(val,old){
				console.info("watch.formData.pics",val,old);
				this.validateField("pics")
				
			},{deep:true})
			
			this.$watch( 'formData.thumb', function(val,old){
				console.info("watch.formData.thumb",val,old);
				this.validateField("thumb")
				
			},{deep:true})
			
			// 计算只读库存数
			this.$watch( 'stockMain.table', function(val,old){
				console.info("watch.stockMain.table",val,old);
				// console.log( this.stockMain.table )
				let rlt = 0;
				if (val.length) {
					val.map((el, i) => {
						if (el.stock !== '') {
							rlt += el.stock
						}
					})
				}
				
				
				this.stock_readOnly = rlt
				
				this.validateField("stockMain", true)
				
			},{deep:true})
			
    },
		updated() {
      console.warn("updated", this.formData.detail)
    },
		beforeDestroy(){
			console.warn("beforeDestroy", this.ueObj);
			if(this.ueObj){
				this.ueObj.destroy();
			}
			
			// 重置state数据
			store.dispatch(A_FORM_RESET)
			
		}
  }

</script>
