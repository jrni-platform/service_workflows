import template from './workflow_picker.html';

import Configurator from 'bookingbug-configurator-js';
import './workflow_picker.scss';
import { bbAuthorisation } from 'bookingbug-core-js';

// add this bullet picker as a new page
Configurator.addPage('Services', 'workflow_picker', { 
    style: 'tab',
    layout: [
        [
          {
            type: 'bb-workflow-picker-panel',
            width: 12,
            index: 0,
            panel_params: {
            }
          }
        ]
    ]
});

// add a bullet picker as a service tab
Configurator.addNamedTab('service_profile', { 
    name: 'Service Workflows',
    path: '.views({view: "workflow_picker"})',
    position: -1
});


class WorkflowPickerCtrl {
    constructor($timeout) {
        this.$timeout = $timeout;
        this.company = bbAuthorisation.getCompany();

        // get the current service from the filter that is passed in
        this.service = this.filter.service;
        this.enabledItems = {};
        this.unsavedChanges = false;

        // get the service_workflows
        this.getServiceWorkflows();
      
    }

    async getServiceWorkflows(){
        try {
            this.app = await this.company.$get('apps', {app_name: 'service_workflows' });

            // get all service_workflows
            this.app.$flush('workflows');
            // for all call that returns a collection - we have to currently make two calls to take about the embedded collcation
            this.workflows = (await ( await this.app.$get('workflows')).$get('custom_objects'));


            console.log(this.service)

            if (this.service.$has('service_workflows.workflow')){
                const link = this.service.$href('service_workflows.workflow')
                this.workflows.map( (workflow) => {
                    if (workflow.$href('self') == link){
                        this.workflow = workflow.id
                    }
                });
            }

        } catch (err) {
            console.error(err);
        }
    }

    toggleItem(id) {
        this.enabledItems[id] = !this.enabledItems[id];
        this.unsavedChanges = true;
        this.showSuccessMessage = false;
    }

    /**
     * Check if the name passed in contains the search filter
     * @param {string} name The name of the toggleable item.
     * @returns {boolean} True if the name contains the search filter string.
     */
    matchesFilter(name) {
        return name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1;
    }    


    /**
     * Updates the workflow map entries on the service, either creating or deleteing them as needed
     */
    async save() {
        console.log(this)
        try {

            const service = await this.service.$update({"service_workflows.workflow_id": this.workflow})

            this.unsavedChanges = false;
            this.showSuccessMessage = true;
            this.$timeout(() => {
                this.showSuccessMessage = false;
            }, 3000);

        } catch (err) {
            console.error(err);
        }
    }

  
}

// set up the angular component
const workflowPickerPanel = {
    templateUrl: template.id,
    controller: WorkflowPickerCtrl,
    scope: true,
    bindings: {
        filter: '<'
    }
};

angular
    .module('BBAdminDashboard')
    .component('bbWorkflowPickerPanel', workflowPickerPanel);
