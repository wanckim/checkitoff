(function() {
  function Task($firebaseArray) {
    var Task = {};
    var ref = firebase.database().ref().child("tasks").orderByChild("priority");
    var list = $firebaseArray(ref);

    Task.all = list;

    Task.add = function(task, pri) {
      var timeArr = getTime();
      var newTask = {
        task: task,
        createdAt: timeArr[0],
        expireAt: timeArr[1],
        state: "active",
        priority: pri
      }

      list.$add(newTask).then(function(ref) {
        var id = ref.key;
        console.log("Task added: \n- " +
                    newTask.task + "\n- " +
                    newTask.expireAt + "\n- " +
                    newTask.state + "\n- " +
                    newTask.priority)
        list.$indexFor(id);
      });
    };

    Task.toggle = function(task) {
      if (task.state === "completed") {
        task.state = "active";
        list.$save(task);
      } else {
        task.state = "completed";
        list.$save(task);
      };
      console.log("\""+task.task+"\"" + " is now " + task.state);
    };

    Task.expired = function(task) {
      var currentDate = new Date();
      var expireDate = new Date(task.expireAt);

      return currentDate > expireDate;
    }

    var getTime = function() {
      var currentTime = new Date();

      var expiration = new Date();
      expiration.setDate(expiration.getDate() + 7);

      var createdAt = (currentTime.getMonth() + 1) + "-" +
                       currentTime.getDate() + "-" +
                       currentTime.getFullYear();

      var expireAt = (expiration.getMonth() + 1) + "-" +
                      expiration.getDate() + "-" +
                      expiration.getFullYear();

      var timeStamp = [createdAt, expireAt];

      return timeStamp;
    };

    return Task;
  }

  angular
    .module('checkItOff')
    .factory('Task', ['$firebaseArray', Task])
})();
