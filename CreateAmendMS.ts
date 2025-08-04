import { css, html, LitElement } from 'lit';
import { createContext, contexts } from '@scdevkit/service-bench-core';
import { state, property } from 'lit/decorators.js';
import { CommonStyles } from '../common/CommonStyles';
import { MSService } from './../services/MSTeamService';

const userContext = createContext(contexts.USER);

export class MSMain extends LitElement {
  static styles = [CommonStyles, css``];
  _userContextConsumer = userContext.createConsumer(this);

  @state() showFullPageLoader = true;
  @state() tableChangeLoder: boolean = false;
  @state() showCreateModal = false;
  @state() showAmendModal = false;
  @state() headerOptions: any[] = [];
  @state() teamNameErr: boolean = false;
  @state() teamMemErr: boolean = false;
  @state() toastStatus: boolean = false;
  @state() toastMessage = '';
  @state() toastType = 'success';
  @state() toastTitle = 'Success';
  @state() operatorID: string = '';
  @state() operatorName: string = '';
  @state() selectedName = '';
  @state() filterName: string = '';
  @state() filterMembers: string = '';
  @state() data: any = [];
  @state() pageSize: number = 10;
  @state() pageNumber: number = 1;
  @state() totalCount: number = 0;
  @state() displayTableconf: any = [
    {
      property: 'name',
      header: 'MS team name',
      flex: 1,
      filterable: true,
      filterLookup: async (props: any) => {
        return await this.handleFilterLookup(props.keyword, 'smeWorkQueue');
      },
    },
    {
      property: 'members',
      header: 'MS team members',
      flex: 1,
      filterable: true,
      filterLookup: async (props: any) => {
        return await this.handleFilterLookup(props.keyword, 'smeQueueMember');
      },
    },
    {
      property: 'actions',
      header: 'Actions',
      cell: (props: { cell: any }) => {
        const dt: any = props.cell.row.original;
        return html`
          <sc-icon-button
            type="link"
            state="default"
            size="sm"
            name="edit-alt--line"
            @click="${() => this.openAmendModal(dt.name)}"
          >
          </sc-icon-button>
        `;
      },
    },
  ];

  constructor() {
    super();
    this.headerOptions = ['SuperAdmin'];
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.loadData();
    this.getLoggedInUser();
    this.showFullPageLoader = false;
  }

  async handleFilterLookup(keyword: string, column: string) {
    if (keyword.length < 2) {
      return;
    }
    const filter = JSON.stringify(JSON.stringify({ [column]: keyword }));
    const res = await MSService.get_MSTeamFiltered(this, '', '', 1, 10, filter);
    const filterList = res?.get_MSTeamFiltered.msWbMemberDtoList.map(
      (ms: any) => ({ label: ms[column], value: ms[column] }),
    );
    return filterList;
  }

  getLoggedInUser() {
    const userData: any = this._userContextConsumer.value;
    const loggedInUser = userData;
    this.operatorID = loggedInUser?.id?.toString();
    this.operatorName = loggedInUser?.firstName?.toString();
  }

  loadData = async (filterflag: boolean = false) => {
    this.tableChangeLoder = true;
    const mslist = await this.get_MSTeamFiltered(
      this.filterMembers,
      this.filterName,
      filterflag ? 1 : this.pageNumber,
      this.pageSize,
      null,
    );
    this.totalCount = mslist?.totalCount;
    this.pageNumber = mslist?.currentPageNumber;
    this.data = mslist?.msWbMemberDtoList.map((ms: any) => ({
      members: ms.smeQueueMember,
      name: ms.smeWorkQueue,
    }));
    this.tableChangeLoder = false;
  };

  get_MSTeamFiltered = async (
    filterMembers: string,
    filterName: string,
    pageNumber: number,
    pageSize: number,
    filter: string | null,
  ) => {
    const filterStr = filter ? filter : null;
    const res = await MSService.get_MSTeamFiltered(
      this,
      filterMembers,
      filterName,
      pageNumber,
      pageSize,
      filterStr,
    );
    const mslist = res?.get_MSTeamFiltered || {};
    return mslist;
  };

  /**
   * @param description - Render the loader
   */
  renderLoading() {
    return html`
      <sc-content-loader
        style="padding: 20px"
        type="line"
        height="16px"
        radius="sm"
      ></sc-content-loader>
    `;
  }

  handleCreateMSTeam = async (e: any) => {
    const payload = e.detail.map((team: any) => ({
      smeQueueMember: team.members.join(','),
      smeWorkQueue: team.name,
      createOperator: this.operatorID,
      createOpName: this.operatorName,
      teamType: 'MS',
    }));
    this.showFullPageLoader = true;
    let data = JSON.stringify(JSON.stringify({ msWbMemberDtoList: payload }));
    const res = await MSService.post_addMsTeams(this, data);
    if (res?.post_addMsTeams.code == '201') {
      this.toastStatus = true;
      this.toastType = 'success';
      this.toastTitle = 'MS team creation';
      this.toastMessage = res.post_addMsTeams.detail;
      this.loadData();
    } else {
      this.toastStatus = true;
      this.toastType = 'error';
      this.toastTitle = 'MS team creation failed';
      this.toastMessage = 'Service error, please try again later ';
    }
    this.showCreateModal = false;
    this.showFullPageLoader = false;
  };

  handleAmendMSTeam = async (e: any) => {
    const members = e.detail?.members;
    const team = e.detail?.team;
    this.showFullPageLoader = true;
    const res = await MSService.save_amendMsTeams(
      this,
      members,
      team,
      this.operatorID,
      this.operatorName,
    );
    if (res?.save_amendMsTeams.code == '200') {
      this.toastStatus = true;
      this.toastType = 'success';
      this.toastTitle = 'MS Team Amendment';
      this.toastMessage = res.save_amendMsTeams.detail;
      this.loadData();
    } else {
      this.toastStatus = true;
      this.toastType = 'error';
      this.toastTitle = 'MS Team Amendment Failed';
      this.toastMessage = 'Service error, please try again later';
    }
    this.showAmendModal = false;
    this.selectedName = '';
    this.showFullPageLoader = false;
  };

  openAmendModal = (name: string) => {
    this.selectedName = name;
    this.showAmendModal = true;
  };

  _handleAmendModalClose() {
    this.showAmendModal = false;
    this.selectedName = '';
  }

  async handleFilter(event: {
    detail: { columnFilterValues: [{ id: string; value: [] }] };
  }) {
    this.tableChangeLoder = true;
    const columnFilterValues = event.detail?.columnFilterValues;
    if (columnFilterValues.length) {
      columnFilterValues.forEach((_, i: number) => {
        let property = columnFilterValues[i]?.id ?? '';
        let selectedFilterValue = columnFilterValues.map(
          (item: any) => `${item.value}`,
        );
        if (property === 'name')
          this.filterName = selectedFilterValue.join(',');
        else if (property === 'members')
          this.filterMembers = selectedFilterValue.join(',');
      });
    } else {
      this.filterName = '';
      this.filterMembers = '';
    }
    this.loadData(true);
  }

  _handleAmend() {
    this.showAmendModal = true;
  }

  _handleCreateModal() {
    this.showCreateModal = true;
  }

  toastClosed() {
    this.toastStatus = false;
    this.toastMessage = '';
  }

  async handlePageChange(event: any) {
    this.tableChangeLoder = true;
    this.pageSize = event.detail.pageSize;
    if (this.totalCount <= this.pageSize) {
      this.pageNumber = 1;
    } else {
      this.pageNumber = event.detail.page;
    }
    await this.loadData();
    this.tableChangeLoder = false;
  }

  render() {
    return html` <div slot="content">
      <sb-acr-app-loader
        .showFullPageLoader=${this.showFullPageLoader}
      ></sb-acr-app-loader>

      <sb-acr-shared-toast
        .displayStatus=${this.toastStatus}
        .type=${this.toastType}
        .title=${this.toastTitle}
        .toastMessage=${this.toastMessage}
        @acr-hide-toast-clicked=${this.toastClosed}
      >
      </sb-acr-shared-toast>

      ${!this.showFullPageLoader
        ? html`
            <div class="mainContainer">
              <div class="fixed-header">
                <sb-acr-shared-form-header
                  .headerOptions=${this.headerOptions}
                  .forPage=${"createAmendMS"}
                  @acr-amend-ms-clicked=${this._handleAmend}
                  @acr-create-ms-clicked=${this._handleCreateModal}
                >
                </sb-acr-shared-form-header>
              </div>
              <div classs="headerTitle"><h2>Create/Amend MS teams</h2></div>

              <sc-data-grid
                manual-filter
                @sc-filter=${this.handleFilter}
                .data=${this.data}
                .columns=${this.displayTableconf}
              >
              </sc-data-grid>
              ${this.tableChangeLoder ? this.renderLoading() : null}
              <sc-pagination
                mode="default"
                size="sm"
                alignment="right"
                label=""
                total=${this.totalCount}
                total-pages="0"
                current-page=${this.pageNumber}
                @sc-change=${this.handlePageChange}
                page-size=${this.pageSize}
                size-changer=""
              >
              </sc-pagination>
              ${this.showCreateModal
                ? html`<sb-acr-plugin-ui-ms-create-side-sheet
                    .showCreateModal=${this.showCreateModal}
                    @acr-create-modal-closed=${() => (this.showCreateModal = false)}
                    @acr-create-clicked=${this.handleCreateMSTeam}
                  ></sb-acr-plugin-ui-ms-create-side-sheet>`
                : null}
              ${this.showAmendModal
                ? html`<sb-acr-plugin-ui-ms-amend-side-sheet
                    .showAmendModal=${this.showAmendModal}
                    @acr-amend-modal-closed=${this._handleAmendModalClose}
                    .msTeamName=${this.selectedName}
                    @acr-amend-clicked=${this.handleAmendMSTeam}
                  ></sb-acr-plugin-ui-ms-create-side-sheet>`
                : null}
            </div>
          `
        : null}
    </div>`;
  }
}
