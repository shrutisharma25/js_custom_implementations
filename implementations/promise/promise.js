function MyPromise(executor) {
  let state = 'pending'; // "pending", "fulfilled", or "rejected"
  let value; // Stores resolved or rejected value
  let handlers = []; // Stores .then() or .catch() handlers

  function resolve(val) {
    if (state !== 'pending') return;
    state = 'fulfilled';
    value = val;
    handlers.forEach((h) => h()); // Execute stored handlers
  }

  function reject(err) {
    if (state !== 'pending') return;
    state = 'rejected';
    value = err;
    handlers.forEach((h) => h()); // Execute stored handlers
  }

  executor(resolve, reject); // Run executor immediately

  return {
    then(onFulfilled, onRejected) {
      function handle() {
        if (state === 'fulfilled' && onFulfilled) {
          onFulfilled(value);
        } else if (state === 'rejected' && onRejected) {
          onRejected(value);
        }
      }

      if (state === 'pending') {
        handlers.push(handle); // Store if still pending
      } else {
        handle(); // Execute immediately if already settled
      }
    },

    catch(onRejected) {
      return this.then(null, onRejected);
    },
  };
}

let promise = MyPromise((resolve, reject) => {
  setTimeout(() => {
    let number = Math.floor(Math.random() * 20); // 0–19
    console.log('Generated number:', number);

    if (number < 10) {
      reject(`Number too low: ${number}`);
    } else {
      resolve(`Number is acceptable: ${number}`);
    }
  }, 2000);
});

promise.then((result) => {
  console.log('Resolved:', result);
});

promise.catch((error) => {
  console.log('Rejected:', error);
});

// function MyPromise(executor) {
//   /*
//    * Initial state of the promise.
//    * - 'pending': The promise is still in progress.
//    * - 'fulfilled': The promise was resolved successfully.
//    * - 'rejected': The promise was rejected due to an error.
//    */
//   let state = 'pending';
//   let value; // Stores the resolved or rejected value
//   let handlers = []; // Stores functions to execute when resolved/rejected
//
//   /*
//    * Resolve function to fulfill the promise.
//    * - Changes the state to 'fulfilled'.
//    * - Stores the resolved value.
//    * - Calls any stored handlers waiting for resolution.
//    */
//   function resolve(val) {
//     if (state !== 'pending') return; // Ensure state change happens only once
//     state = 'fulfilled';
//     value = val;
//     handlers.forEach((h) => h()); // Execute stored handlers
//   }
//
//   /*
//    * Reject function to reject the promise.
//    * - Changes the state to 'rejected'.
//    * - Stores the rejection reason.
//    * - Calls any stored handlers waiting for rejection.
//    */
//   function reject(err) {
//     if (state !== 'pending') return; // Ensure state change happens only once
//     state = 'rejected';
//     value = err;
//     handlers.forEach((h) => h()); // Execute stored handlers
//   }
//
//   // Execute the provided executor function with resolve and reject
//   executor(resolve, reject);
//
//   return {
//     /*
//      * Then method for chaining promise actions.
//      * - If the promise is already fulfilled or rejected, execute the handler immediately.
//      * - Otherwise, store the handler for execution once resolved or rejected.
//      */
//     then(onFulfilled, onRejected) {
//       return MyPromise((resolve, reject) => {
//         function handle() {
//           try {
//             if (state === 'fulfilled') {
//               resolve(onFulfilled ? onFulfilled(value) : value);
//             } else if (state === 'rejected') {
//               reject(onRejected ? onRejected(value) : value);
//             }
//           } catch (error) {
//             reject(error); // Catch any error in the handlers
//           }
//         }
//
//         if (state === 'pending') {
//           handlers.push(handle); // Store for later execution
//         } else {
//           handle(); // Execute immediately if already settled
//         }
//       });
//     },
//
//     /*
//      * Catch method to handle errors.
//      * - Equivalent to calling then(null, onRejected).
//      */
//     catch(onRejected) {
//       return this.then(null, onRejected);
//     },
//   };
// }
//
// /*
//  * Example usage:
//  * - Creates a new promise that resolves after 1 second.
//  * - When resolved, it logs the result using console.log.
//  * - If an error occurs, it logs the error using console.error.
//  */
// MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('Success!'); // Resolves after 1 second
//   }, 1000);
// })
//   .then((result) => {
//     console.log(result); // Logs "Success!"
//   })
//   .catch((error) => {
//     console.error(error); // Logs any errors if they occur
//   });
