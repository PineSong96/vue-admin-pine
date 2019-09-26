<template>
  <div class='basic'>
    <el-row>
      <el-col :span='24'>
        <el-card>
          <div slot="header">
            账号管理
          </div>
          <el-form :inline="true"  class="demo-form-inline">
            <el-form-item label="">
              <el-button class="w150" type="success" @click="addUserDialog()">添加账号</el-button>
            </el-form-item>
          </el-form>
          <div class="table-wrapper">
            <el-table
              v-loading="loading"
              element-loading-text="加载数据中"
              :data='tableData'
              border
              :row-class-name="addRowClass">
              <el-table-column label="用户账号" prop="usercode" align="center"></el-table-column>
              <el-table-column label="用户名" prop="username" align="center"></el-table-column>
              <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
              <el-table-column label="账号状态" align="center">
                <template slot-scope="scope">
                  {{lockedStatus[scope.row.locked].label}}
                  <el-switch @change="changeLock(scope.row)"
                             v-model="scope.row.locked"
                             active-color="#13ce66"
                             inactive-color="#ff4949"
                             active-value="0"
                             inactive-value="1"  >
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作 " align="center">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" circle @click="editDialog(scope.row)"></el-button>
                  <el-button type="danger" icon="el-icon-delete" circle @click="deleteUser(scope.row.id)"></el-button>
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
                         :visible.sync="editUserdialog"
                         width="30%"
                         :before-close="handleClose"
                         :modal-append-to-body='false'>
                <el-form ref="form" :model="editData" label-width="100px">
                  <el-form-item label="账号" prop="usercode">
                    <el-input v-model="editData.usercode"></el-input>
                  </el-form-item>
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="editData.username"></el-input>
                  </el-form-item>
                  <el-form-item label="角色" prop="roleId">
                    <el-select v-model="editData.roleId" placeholder="请选择角色">
                      <el-option
                        v-for="item in roleData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
              <el-button @click=handleClose()>取 消</el-button>
              <el-button type="primary" @click="editUser(editData)">确 定</el-button>
            </span>
              </el-dialog>

              <el-dialog class="addUser"
                         title="添加用户"
                         :visible.sync="addUserdialog"
                         width="30%"
                         :before-close="addUserClose"
                         :modal-append-to-body='false'>
                <el-form ref="form" :model="addData" label-width="100px"  :rules="rules">
                  <el-form-item label="账号" prop="usercode">
                    <el-input v-model="addData.usercode"></el-input>
                  </el-form-item>
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="addData.username"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="password">
                    <el-input v-model="addData.password" type="password"></el-input>
                  </el-form-item>
                  <el-form-item label="角色" prop="roleId">
                    <el-select v-model="addData.roleId" placeholder="请选择角色">
                      <el-option
                        v-for="item in roleData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
              <el-button @click=addUserClose()>取 消</el-button>
              <el-button type="primary" @click="addUser(addData)">确 定</el-button>
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
      this.getRoleData();
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
        editUserdialog: false,
        addUserdialog: false,
        editData: {},
        addData: {},
        roleData: [],
        rules: {
          usercode: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          roleId: [
            {required: true, message: '角色不能为空', trigger: 'blur'}
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
        this.$get('/system/sysuser/page', params)
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
      // 获得角色信息
      getRoleData() {
        this.$get('/system/sysrole/all')
          .then(
            response => {
              if (response.status === 200) {
                if (response.data.success === true) {
                  this.roleData = response.data.data;
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
        this.editUserdialog = true;
      },
      // 添加用户
      addUserDialog() {
        this.addUserdialog = true;
      },
      addUserClose() {
        this.addData = {};
        this.addUserdialog = false;
      },
      addUser(row) {
        let params = this.$utils.paramData(row);
        this.$post('/system/sysuser/save', params)
          .then(
            response => {
              if (response.status === 200) {
                if (response.data.success === true) {
                  this.$message.success('添加用户成功');
                  this.addData = {};
                } else if (response.data.success === false) {
                  this.$message.error(response.data.error);
                } else {
                  this.$message.error('服务异常');
                }
              }
              // 关闭弹框
              this.addUserdialog = false;
              this.getTableData();
            }
          );
      },

      // 更新用户信息
      editUser(row) {
        console.log(row);
        this.$delete(row, 'createTime')
        this.$delete(row, 'updateTime')
        let params = this.$utils.paramData(row);
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
              // 关闭弹框
              this.editUserdialog = false;
              this.getTableData();
            }
          );
      },
      handleClose() {
        this.editUserdialog = false;
        this.editData = {};
      },
      // 更改用户是否锁定状态
      changeLock(row) {
        let data = {
          id: row.id,
          locked: row.locked
        }
        let params = this.$utils.paramData(data);
        this.$post('/system/sysuser/changeLocked', params)
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
      // 更改用户是否锁定状态
      deleteUser(id) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            id: id
          }
          let params = this.$utils.paramData(data);
          this.$del('/system/sysuser/del', params)
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
