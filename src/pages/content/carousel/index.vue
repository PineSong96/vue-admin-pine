<template>
  <div class='carousel'>
    <el-row>
      <el-col :span='24'>
        <el-card>
          <div slot="header">
            Banner
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
              <el-table-column label="概述" prop="note" align="center"></el-table-column>
              <el-table-column label="图片" align="center">
                <template slot-scope="scope">
                     <img :src=scope.row.path alt="" style="width: 100px;height:100px">
                </template>
              </el-table-column>
              <el-table-column label="类型" align="center">
                <template slot-scope="scope">
                    {{carouselType[scope.row.type].label}}
                </template>
              </el-table-column>
              <el-table-column label="位置" prop="position" align="center"></el-table-column>
              <el-table-column label="序号" prop="sort" align="center"></el-table-column>
              <el-table-column label="跳转地址" align="center">
                <template slot-scope="scope">
                  <a :href=scope.row.link
                     target="_blank"
                     class="buttonText">{{scope.row.link}}</a>
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
                  <el-form-item label="概述" prop="note">
                    <el-input v-model="editData.note"></el-input>
                  </el-form-item>
                  <el-form-item label="类型" prop="type">
                    <el-select v-model="editData.type" placeholder="请选择位置">
                      <el-option
                        v-for="item in carouselType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
<!--                  <el-form-item label="位置" prop="position">-->
<!--                    <el-input v-model="editData.position"></el-input>-->
<!--                  </el-form-item>-->
                  <el-form-item label="序号" prop="sort">
                    <el-input v-model="editData.sort"></el-input>
                  </el-form-item>
                  <el-form-item label="跳转地址" prop="link">
                    <el-input v-model="editData.link" placeholder="例: http://www.baidu.com"></el-input>
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
                  <el-form-item label="概述" prop="note">
                    <el-input v-model="addData.note"></el-input>
                  </el-form-item>
                  <el-form-item label="类型" prop="type">
                    <el-select v-model="addData.type" placeholder="请选择位置">
                      <el-option
                        v-for="item in carouselType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="位置" prop="position">
                    <el-input v-model="addData.position"></el-input>
                  </el-form-item>
                  <el-form-item label="序号" prop="sort">
                    <el-input v-model="addData.sort"></el-input>
                  </el-form-item>
                  <el-form-item label="跳转地址" prop="link">
                    <el-input v-model="addData.link" placeholder="例: http://www.baidu.com"></el-input>
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
  </div>

</template>

<script>
  import {formatDate} from 'src/utils/utils';
  import score from 'src/components/Score/index';
  import * as Api from 'src/utils/server'

  const POSITIVE = 0;
  const NEGATIVE = 1;
  export default {
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
        editData: {},
        addData: {},
        uploadUrl: Api.imgUrl,
        carouselType: [
          {
            label: '首页',
            value: 0
          },
          {
            label: '公司简介',
            value: 1
          },
          {
            label: 'JETOUR捷途',
            value: 2
          },
          {
            label: '新闻动态',
            value: 3
          },
          {
            label: '活动专区',
            value: 4
          },
          {
            label: '精彩视频',
            value: 5
          },
          {
            label: '人才招聘',
            value: 6
          },
          {
            label: '联系我们',
            value: 7
          },
          {
            label: '旅行+',
            value: 8
          },
          {
            label: '合伙人招募',
            value: 9
          },
          {
            label: '经销商查询',
            value: 10
          },
          {
            label: '预约试驾',
            value: 11
          },
          {
            label: '金融服务',
            value: 12
          },
          {
            label: '贷款计算器',
            value: 12
          },
          {
            label: '服务商查询',
            value: 13
          }

        ],
        imageUrl: '',
        rules: {
          type: [
            {required: true, message: '请选择类型', trigger: 'blur'}
          ],
          link: [
            {required: false, message: '', trigger: 'blur'},
            {
              // eslint-disable-next-line no-useless-escape
              pattern: /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/,
              message: '请输入正确的链接地址'
            }
          ]
        }
      }
    },
    methods: {
      getTableData() {
        let params = {
          pagesize: this.pagesize,
          currentpage: this.currentpage
        }
        this.$get('/business/Carousel/page', params)
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
        this.$post('/business/Carousel/save', params)
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
        this.$put('/business/Carousel/update', params)
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

      // 删除信息
      deleteData(id) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$del('/business/Carousel/del/' + id)
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
      // 上传多图
      uploadSuccessOther(response, file, fileList) {
        if (fileList.length > 0) {
          fileList.forEach((item, index) => {
            this.imgUrls.push(item.response.data[0]);
          });
          sessionStorage.setItem('imgUrls', fileList);
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
      }
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
  }
</style>
