<template>
  <div class='news'>
    <el-row>
      <el-col :span='24'>
        <el-card>
          <div slot="header">
            新闻活动
          </div>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-button class="w150" type="success" @click="addDataDialog()">添加</el-button>
            </el-form-item>
          </el-form>
          <div class="table-wrapper">
            <el-table
              v-loading="loading"
              element-loading-text="加载数据中"
              :data='tableData'
              border
              :row-class-name="addRowClass">
              <el-table-column label="标题" prop="name" align="center"></el-table-column>
              <el-table-column label="图片" align="center">
                <template slot-scope="scope">
                     <img :src=scope.row.path alt="" style="width: 100px;height:100px">
                </template>
              </el-table-column>
              <el-table-column label="类型" align="center">
                <template slot-scope="scope">
                    {{newsType[scope.row.type].label}}
                </template>
              </el-table-column>
              <el-table-column label="操作 " align="center">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" circle @click="editDialog(scope.row)"></el-button>
                  <el-button type="danger" icon="el-icon-delete" circle @click="deleteData(scope.row.id)"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              style="margin-top: 16px; text-align:right;"
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[5, 10, 15, 20]"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange">
            </el-pagination>
            <template>
              <el-dialog class="upload"
                         title="上传图片"
                         :visible.sync="uploadialog"
                         width="300px"
                         :before-close="uploadClose"
                         :modal-append-to-body='false'>
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    :on-success="richUploadSuccess"
                    :on-remove="handleRemove"
                    :on-error="uploadFailed">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
              </el-dialog>

              <el-dialog class="editData"
                         title="编辑"
                         :visible.sync="editDatadialog"
                         width="30%"
                         :before-close="handleClose"
                         :modal-append-to-body='false'>
                <el-form ref="form" :model="editData" label-width="100px" :rules="rules">
                  <el-form-item label="展示图" prop="link">
                    <el-upload
                      class="avatar-uploader"
                      :action="uploadUrl"
                      :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                      :on-success="uploadSuccess"
                      :on-remove="handleRemove"
                      :on-error="uploadFailed">
                      <img v-if="editData.path" :src="imageUrl" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="标题" prop="name">
                    <el-input v-model="editData.name"></el-input>
                  </el-form-item>
                  <el-form-item label="类型" prop="type">
                    <el-select v-model="editData.type" placeholder="请选择位置">
                      <el-option
                        v-for="item in newsType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="内容" prop="content">

                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
              <el-button @click=handleClose()>取 消</el-button>
              <el-button type="primary" @click="editDataInfo(editData)">确 定</el-button>
            </span>
              </el-dialog>

              <el-dialog class="addData"
                         title="添加"
                         :visible.sync="addDatadialog"
                         width="30%"
                         :before-close="addDataClose"
                         :modal-append-to-body='false'>
                <el-form ref="form" :model="addData" label-width="100px" :rules="rules">
                  <el-form-item label="展示图" prop="link">
                    <el-upload
                      class="avatar-uploader"
                      :action="uploadUrl"
                      :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                      :on-success="uploadSuccess"
                      :on-remove="handleRemove"
                      :on-error="uploadFailed">
                      <img v-if="imageUrl" :src="imageUrl" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="标题" prop="name">
                    <el-input v-model="addData.name"></el-input>
                  </el-form-item>
                  <el-form-item label="类型" prop="type">
                    <el-select v-model="addData.type" placeholder="请选择位置">
                      <el-option
                        v-for="item in newsType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="内容" prop="content">
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
              <el-button @click=addDataClose()>取 消</el-button>
              <el-button type="primary" @click="addDataInfo(addData)">确 定</el-button>
            </span>
              </el-dialog>
            </template>

          </div>
        </el-card>
      </el-col>
    </el-row>
    <div id="quill-editor" style="height: 600px"></div>
    <div class="quill-count">
      <span class="number">{{richCurrentLength}}/{{richMaxLength}}</span>
    </div>
  </div>

</template>

<script>
  import {formatDate} from 'src/utils/utils';
  import score from 'src/components/Score/index';
  import * as Api from 'src/utils/server'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import Quill from 'quill'
  import ImageResize from 'quill-image-resize-module'
  Quill.register('modules/imageResize', ImageResize)


  const POSITIVE = 0;
  const NEGATIVE = 1;


  export default {
    // 富文本工具栏配置
    toolbarOptions: [
      [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     // 几级标题
      ['bold', 'italic', 'underline', 'strike'],    // 加粗，斜体，下划线，删除线
      [{ 'indent': '-1' }, { 'indent': '+1' }],     // 缩进
      [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
      [{ 'align': [] }],    // 对齐方式
      ['clean'],    // 清除字体样式
      ['image'],
      ['custom']  // 添加一个自定义功能
    ],
    created() {
      this.getTableData();
    },
    data() {
      return {
        tableData: [],
        loading: true,
        pagesize: 10,
        currentpage: 1,
        total: 0,
        editDatadialog: false,
        addDatadialog: false,
        uploadialog: false,
        editData: {},
        addData: {},
        uploadUrl: Api.imgUrl,
        imageUrl: '',
        newsType: [
          {
            label: '新闻动态',
            value: 0
          }, {
            label: '活动专区',
            value: 1
          }
        ],
        rules: {
          type: [
            {required: true, message: '请选择类型', trigger: 'blur'}
          ]
        },
        // 富文本内容
        content: '',
        richMaxLength: 800,
        richCurrentLength: 0,
        indexPos: ''
      }
    },
    watch: {
      content() {
        // 富文本内容长度
        this.richCurrentLength = this.quill.getLength() - 1
        let numWrapper = document.querySelector('.quill-count')
        console.log(numWrapper)
        if (this.richCurrentLength > this.richMaxLength) {
          numWrapper.style.color = 'red'
        } else {
          numWrapper.style.color = '#666'
        }
      }
    },
    methods: {
      getTableData() {
        let params = {
          pagesize: this.pagesize,
          currentpage: this.currentpage
        }
        this.$get('/business/News/page', params)
          .then(
            response => {
              if (response.status === 200) {
                if (response.data.success === true) {
                  this.tableData = response.data.data.pp;
                  this.total = response.data.data.page.totalNumber;
                  this.loading = false;
                } else if (response.data.success === false) {
                  this.$message.error(response.data.error);
                } else {
                  this.$message.error('服务异常');
                }
              }
            }
          );
      },
      // 编辑用户信息弹窗打开
      editDialog(row) {
        this.editData = row;
        this.imageUrl = row.path;
        this.editDatadialog = true;
      },
      // 添加用户
      addDataDialog() {
        this.addDatadialog = true;
      },
      addDataClose() {
        this.addData = {};
        this.addDatadialog = false;
      },
      addDataInfo(row) {
        row.path = this.imageUrl;
        let params = this.$utils.paramData(row);
        this.$post('/business/News/save', params)
          .then(
            response => {
              if (response.status === 200) {
                if (response.data.success === true) {
                  this.$message.success('添加成功');
                  this.addData = {};
                } else if (response.data.success === false) {
                  this.$message.error(response.data.error);
                } else {
                  this.$message.error('服务异常');
                }
              }
              // 关闭弹框
              this.imageUrl = '';
              this.addDatadialog = false;
              this.getTableData();
            }
          );
      },
      // 更新信息
      editDataInfo(row) {
        row.path = this.imageUrl;
        this.$delete(row, 'createTime')
        this.$delete(row, 'updateTime')
        let params = this.$utils.paramData(row);
        this.$put('/business/News/update', params)
          .then(
            response => {
              if (response.status === 200) {
                if (response.data.success === true) {
                  this.$message.success('修改成功');
                } else if (response.data.success === false) {
                  this.$message.error(response.data.error);
                } else {
                  this.$message.error('服务异常');
                }
              }
              // 关闭弹框
              this.imageUrl = '';
              this.editDatadialog = false;
              this.getTableData();
            }
          );
      },
      handleClose() {
        this.editDatadialog = false;
        this.editData = {};
      },
      uploadClose() {
        this.uploadialog = false;
        this.imageUrl = '';
      },
      // 删除信息
      deleteData(id) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$del('/business/News/del/' + id)
            .then(
              response => {
                if (response.status === 200) {
                  if (response.data.success === true) {
                    this.$message.success('删除成功');
                  } else if (response.data.success === false) {
                    this.$message.error(response.data.error);
                  } else {
                    this.$message.error('服务异常');
                  }
                }
                this.getTableData();
              }
            );
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 上传前的回调函数
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('请上传JPG / PNG 格式图片!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 图片上传成功
      uploadSuccess(response) {
        if (response.success) {
          this.imageUrl = response.data[0];
          console.log(this.addData.path)
          // 图片上传成功缓存下当前图片url
          sessionStorage.setItem('imgUrl', this.imageUrl);
        } else {
          console.log(response.data);
        }
      },
      // 图片列表删除
      handleRemove(file, fileList) {
      },
      // 上传失败
      uploadFailed(err, file, fileList) {
        console.log('上传失败');
        console.log(err);
      },
      show(scope) {
        console.log(scope);
      },
      handleSizeChange(value) {
        this.pagesize = value;
        this.getTableData();
      },
      handleCurrentChange(value) {
        this.currentpage = value;
        this.getTableData();
      },
      addRowClass({row, rowIndex}) {
        if (row.rateType === NEGATIVE) {
          return 'warning-row';
        }
      },

      // 富文本
      // 富文本中的图片上传
      // 自定义富文本的图片上传
      imageFunction(val) {
        // let res = {
        //   data: [
        //     'http://shopimg.jetour.com.cn/20190926/1569480246117.jpg'
        //   ]
        // }
        if (val) {
          this.indexPos = this.quill.getSelection().index;
          this.uploadialog = true;
        } else {
          this.quill.format('image', false)
        }
      },
      richUploadSuccess(res) {
        this.uploadialog = false;
        /**
         * 如果上传成功
         * ps：不同的上传接口，判断是否成功的标志也不一样，需要看后端的返回
         * 通常情况下，应该有返回上传的结果状态（是否上传成功）
         * 以及，图片上传成功后的路径
         * 将路径赋值给 imgUrl
         */
        if (res) {
          let imgUrl = res.data[0];
          // 获取光标所在位置
          console.log(this.quill)
          let length = this.indexPos;
          // 插入图片，res为服务器返回的图片链接地址
          this.quill.insertEmbed(length, 'image', imgUrl)
          // 调整光标到最后
          this.quill.setSelection(length + 1)
        } else {
          // 提示信息，需引入Message
          this.$message.error('图片插入失败')
        }
      },
      onEditorChange(eventName, ...args) {
        if (eventName === 'text-change') {
          // args[0] will be delta
          // 获取富文本内容
          this.content = document.querySelector('#quill-editor').children[0].innerHTML
        } else if (eventName === 'selection-change') {
          // args[0] will be old range
        }
      },
      // 初始化自定义的quill工具栏
      // 拿到quill实例以后，在执行自定义toolbar的操作
      initCustomQullToolbar() {
        const timeButton = document.querySelector('.ql-custom')
        timeButton.style.cssText = 'width: 80px; outline: none;'
        timeButton.innerText = '自定义'
      },
      // 给自定义的按钮功能加上方法
      quillCustomFunction() {
        const h = this.$createElement
        this.$notify({
          type: 'success',
          title: '自定义一个quill功能',
          message: h('i', {style: 'color: teal'}, '可不可以让我自定义一个 Quill 的功能？可不可以让我自定义一个 Quill 的功能？')
        })
      },
      initQuill() {
        const quill = new Quill('#quill-editor', {
          // 编辑器配置选项
          theme: 'snow',
          placeholder: 'Compose an epic...',
          debug: 'error',
          modules: {
            toolbar: {
              container: this.$options.toolbarOptions,
              handlers: {  // 自定义功能
                'image': this.imageFunction,
                'custom': this.quillCustomFunction
              }
            },
            imageResize: {
              modules: ['Resize', 'DisplaySize', 'Toolbar'],
              handleStyles: {
                backgroundColor: 'black',
                border: 'none',
                color: 'white'
              },
              displayStyles: {
                backgroundColor: 'black',
                border: 'none',
                color: 'white'
              },
              toolbarStyles: {
                backgroundColor: 'black',
                border: 'none',
                color: 'white'
              },
              toolbarButtonStyles: {},
              toolbarButtonSvgStyles: {}
            }
          }
        })
        this.quill = quill
        // 拿到quill实例以后，在执行自定义toolbar的操作
        this.initCustomQullToolbar()
        /**
         * 监听富文本变化
         * editor-change 包括 text-change、selection-change
         * 你也可以分别监听 text-change 和 selection-change
         * 文档：https://quilljs.com/docs/api/#text-change
         */
        quill.on('editor-change', this.onEditorChange)
      }
    },
    mounted() {
      this.initQuill()
    },
    beforeDestroy() {
      this.quill = null
      delete this.quill
    },
    filters: {
      rateTypeToText(rateType) {
        return rateType === POSITIVE ? '满意' : '不满意';
      },
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
    },
    components: {
      score
    }
  };
</script>
<style lang='scss'>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .basic {
    .el-table {
      .warning-row {
        background-color: oldlace;
      }
    }

    .recommend-tag {
      display: inline-block;
      margin: 4px 0;
      margin-right: 4px;

      &:last-child {
        margin-right: 0;
      }
    }
    .content-wrapper {
      max-width: 80%;
      min-width: 800px;
      margin: 0 auto;
      padding-top: 20px;
    }
    .tips {
      width: 600px;
      padding: 15px 20px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      line-height: 2;
    }
    .font {
      font-size: 18px;
    }
    #quill-editor {
      width: 80%;
      height: 500px;
    }
    /*字数统计*/
    .quill-count {
      border: 1px solid #ccc;
      border-top: none;
      height: 30px;
      line-height: 30px;
      text-align: right;
      padding-right: 10px;
      font-size: 14px;
      color: #666;
    }
    /* 内容返显 */
    .ql-editor {
      margin-bottom: 50px;
    }
  }
</style>
