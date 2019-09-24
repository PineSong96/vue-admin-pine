<%--
@Project Name: vue-admin
@Author: luichooy
@Date: 2017-11-16 12:27
@Email: luichooy@163.com
@Idea: WebStorm
--%>

<template>
  <div class='basic'>
    <el-row>
      <el-col :span='24'>
        <el-card>
          <div slot="header">
            账号管理
          </div>
          <div class="table-wrapper">
            <el-table
              v-loading="loading"
              element-loading-text="加载数据中"
              :data='tableData'
              border
              :row-class-name="addRowClass">
              <el-table-column label="用户账号" prop="usercode" align="center"></el-table-column>
              <el-table-column label="用户名" prop="username" align="center"></el-table-column>
              <el-table-column label="角色名称" prop="username" align="center"></el-table-column>

              <el-table-column label="账号状态" align="center">
                <template slot-scope="scope">
                  {{lockedStatus[scope.row.locked].label}}
                  <el-switch @change="changeLock(scope.row)"
                             v-model="scope.row.locked"
                             active-color="#13ce66"
                             inactive-color="#ff4949"
                             active-value="0"
                             inactive-value="1"
                  >
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作 " align="center">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" circle @click="edit"></el-button>
                  <el-button type="danger" icon="el-icon-delete" circle></el-button>
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
              <el-dialog class="editUser"
                title="编辑"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
                <!--              <el-form ref="form" :model="editData" label-width="100px">-->
                <!--                <el-form-item label="账号">-->
                <!--                  <el-input v-model="editData.usercode"></el-input>-->
                <!--                </el-form-item>-->
                <!--                <el-form-item label="用户名">-->
                <!--                  <el-input v-model="editData.username"></el-input>-->
                <!--                </el-form-item>-->
                <!--                <el-form-item label="密码">-->
                <!--                <el-input v-model="editData.password"></el-input>-->
                <!--                </el-form-item>-->

                <!--                <el-form-item label="角色">-->
                <!--                    <el-select v-model="editData.roleId" placeholder="请选择角色">-->
                <!--                      <el-option label="超级管理员" value="shanghai"></el-option>-->
                <!--                      <el-option label="管理员" value="beijing"></el-option>-->
                <!--                    </el-select>-->
                <!--                </el-form-item>-->
                <!--              </el-form>-->
                <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
        lockedStatus: [
          {
            label: '激活',
            value: 0
          },
          {
            label: '锁定',
            value: 1
          }
        ],
        dialogVisible: false,
        editData: {}
      }
    },
    methods: {
      getTableData() {
        let params = {
          pagesize: this.pagesize,
          currentpage: this.currentpage
        }
        this.$get('/system/sysuser/page', params)
          .then(
            response => {
              if (response.status === 200) {
                if (response.data.success === true) {
                  this.tableData = response.data.data;
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
      // 编辑用户信息
      edit(row) {
        this.editData = row;
        this.dialogVisible = true;
      },
      handleClose() {
        this.dialogVisible = false;
        this.editData = {};
      },
      // 更改用户是否锁定状态
      changeLock(row) {
        let data = {
          id: row.id,
          locked: row.locked
        }
        let params = this.$utils.paramData(data);
        this.$post('/system/sysuser/update', params)
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
            }
          );
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
