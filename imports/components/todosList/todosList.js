import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../../api/tasks.js';

import template from './todosList.html';

class TodosListCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.subscribe('tasks');

    this.hideCompleted = false;
    this.sortByText = false;

    this.helpers({
      tasks() {
        const selector = {};
        const options = {
          sort: {
            createdAt: -1
          }
        };

        // If hide completed is checked, filter tasks
        if (this.getReactively('hideCompleted')) {
          selector.checked = {
            $ne: true
          };
        }

        // Custom sort
        const sortByText = this.getReactively('sortByText')
        if (sortByText) {
          options.sort = {
            text: 1,
          }
        }

        return Tasks.find(selector, options);
      },
      incompleteCount() {
        return Tasks.find({
          checked: {
            $ne: true
          }
        }).count();
      },
      currentUser() {
        return Meteor.user();
      }
    })
  }

  addTask(newTask) {
    // Insert a task into the collection
    Meteor.call('tasks.insert', newTask);

    // Clear form
    this.newTask = '';
  }

  setChecked(task) {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', task._id, !task.checked);
  }

  removeTask(task) {
    Meteor.call('tasks.remove', task._id);
  }

  setPrivate(task) {
    Meteor.call('tasks.setPrivate', task._id, !task.private);
  }

  sortBy(field) {
    Meteor.call('tasks.sortBy')
  }
}

export default angular.module('todosList', [
  angularMeteor
])
  .component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: ['$scope', TodosListCtrl]
  });
