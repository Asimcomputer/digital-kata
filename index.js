
  // User authentication and management
  let users = JSON.parse(localStorage.getItem('kataUsers')) || {};
  
  let currentUser = '';
  
  // Check if user is already logged in
  function checkLoginStatus() {
      const savedUser = localStorage.getItem('kataCurrentUser');
      if (savedUser && users[savedUser]) {
          currentUser = savedUser;
          showApp();
      } else {
          showSignup(); // Show signup first since no default accounts
      }
  }
  
  // Show login page
  function showLogin() {
      document.getElementById('login-page').style.display = 'block';
      document.getElementById('signup-page').style.display = 'none';
      document.getElementById('app-container').style.display = 'none';
  }
  
  // Show signup page
  function showSignup() {
      document.getElementById('login-page').style.display = 'none';
      document.getElementById('signup-page').style.display = 'block';
      document.getElementById('app-container').style.display = 'none';
  }
  
  // Show main app
  function showApp() {
      document.getElementById('login-page').style.display = 'none';
      document.getElementById('signup-page').style.display = 'none';
      document.getElementById('app-container').style.display = 'block';
      document.getElementById('user-display').textContent = currentUser;
      
      // Load user-specific data
      loadData();
  }
  
  // Handle login form submission
  document.getElementById('login-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      // Reset error messages
      document.getElementById('username-error').style.display = 'none';
      document.getElementById('password-error').style.display = 'none';
      
      // Validate credentials
      if (!users[username]) {
          document.getElementById('username-error').textContent = 'Username not found';
          document.getElementById('username-error').style.display = 'block';
          return;
      }
      
      if (users[username].password !== password) {
          document.getElementById('password-error').textContent = 'Incorrect password';
          document.getElementById('password-error').style.display = 'block';
          return;
      }
      
      // Successful login
      currentUser = username;
      localStorage.setItem('kataCurrentUser', currentUser);
      showApp();
  });
  
  // Handle signup form submission
  document.getElementById('signup-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('new-username').value;
      const password = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      // Reset error messages
      document.getElementById('new-username-error').style.display = 'none';
      document.getElementById('new-password-error').style.display = 'none';
      document.getElementById('confirm-password-error').style.display = 'none';
      
      // Validate inputs
      if (users[username]) {
          document.getElementById('new-username-error').textContent = 'Username already exists';
          document.getElementById('new-username-error').style.display = 'block';
          return;
      }
      
      if (password.length < 6) {
          document.getElementById('new-password-error').textContent = 'Password must be at least 6 characters';
          document.getElementById('new-password-error').style.display = 'block';
          return;
      }
      
      if (password !== confirmPassword) {
          document.getElementById('confirm-password-error').textContent = 'Passwords do not match';
          document.getElementById('confirm-password-error').style.display = 'block';
          return;
      }
      
      // Create new user
      users[username] = {
          password: password,
          createdAt: new Date().toISOString()
      };
      
      // Save users to localStorage
      localStorage.setItem('kataUsers', JSON.stringify(users));
      
      // Auto-login the new user
      currentUser = username;
      localStorage.setItem('kataCurrentUser', currentUser);
      showApp();
  });
  
  // Switch between login and signup
  document.getElementById('switch-to-signup').addEventListener('click', showSignup);
  document.getElementById('switch-to-login').addEventListener('click', showLogin);
  
  // Logout function
  function logout() {
      currentUser = '';
      localStorage.removeItem('kataCurrentUser');
      showSignup();
      
      // Clear forms
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
      document.getElementById('new-username').value = '';
      document.getElementById('new-password').value = '';
      document.getElementById('confirm-password').value = '';
  }
  
  // Profile functions
  function showProfile() {
      document.getElementById('profile-modal').style.display = 'flex';
      document.getElementById('profile-username').value = currentUser;
      document.getElementById('profile-success').style.display = 'none';
  }
  
  function hideProfile() {
      document.getElementById('profile-modal').style.display = 'none';
  }
  
  function updatePassword() {
      const newPassword = document.getElementById('new-password-profile').value;
      const confirmPassword = document.getElementById('confirm-new-password').value;
      const successMessage = document.getElementById('profile-success');
      
      if (newPassword && newPassword.length < 6) {
          alert('Password must be at least 6 characters');
          return;
      }
      
      if (newPassword !== confirmPassword) {
          alert('Passwords do not match');
          return;
      }
      
      if (newPassword) {
          users[currentUser].password = newPassword;
          localStorage.setItem('kataUsers', JSON.stringify(users));
          successMessage.textContent = 'Password updated successfully!';
          successMessage.style.display = 'block';
          
          // Clear password fields
          document.getElementById('new-password-profile').value = '';
          document.getElementById('confirm-new-password').value = '';
      }
  }
  
  // Initialize amounts and histories
  let amounts = {
      amjad: 0,
      asim: 0,
      awais: 0,
      hamza: 0
  };
  
  let histories = {
      amjad: [],
      asim: [],
      awais: [],
      hamza: []
  };
  
  // Load data from localStorage if available
  function loadData() {
      const savedAmounts = localStorage.getItem(`kataAmounts_${currentUser}`);
      const savedHistories = localStorage.getItem(`kataHistories_${currentUser}`);
      
      if (savedAmounts) {
          amounts = JSON.parse(savedAmounts);
      }
      
      if (savedHistories) {
          histories = JSON.parse(savedHistories);
      }
      
      updateDisplay();
  }
  
  // Save data to localStorage
  function saveData() {
      localStorage.setItem(`kataAmounts_${currentUser}`, JSON.stringify(amounts));
      localStorage.setItem(`kataHistories_${currentUser}`, JSON.stringify(histories));
  }
  
  // Add amount to a member
  function addAmount(member) {
      const input = document.getElementById(`${member}-input`);
      const amount = parseInt(input.value);
      
      if (isNaN(amount) || amount <= 0) {
          alert('Please enter a valid amount');
          return;
      }
      
      // Add to amount
      amounts[member] += amount;
      
      // Add to history with timestamp
      const now = new Date();
      const timestamp = now.toLocaleString();
      histories[member].push({
          amount: amount,
          timestamp: timestamp,
          addedBy: currentUser
      });
      
      // Clear input
      input.value = '';
      
      // Update display and save data
      updateDisplay();
      saveData();
  }
  
  // Reset amount for a specific member
  function resetAmount(member) {
      if (confirm(`Are you sure you want to reset ${member.charAt(0).toUpperCase() + member.slice(1)}'s contributions?`)) {
          amounts[member] = 0;
          histories[member] = [];
          updateDisplay();
          saveData();
      }
  }
  
  // Reset all amounts
  function resetAll() {
      if (confirm('Are you sure you want to reset all contributions?')) {
          amounts = {
              amjad: 0,
              asim: 0,
              awais: 0,
              hamza: 0
          };
          
          histories = {
              amjad: [],
              asim: [],
              awais: [],
              hamza: []
          };
          
          updateDisplay();
          saveData();
      }
  }
  
  // Calculate equal share and balances
  function calculateEqualShare() {
      const total = amounts.amjad + amounts.asim + amounts.awais + amounts.hamza;
      const equalShare = total / 4;
      
      return {
          total,
          equalShare,
          balances: {
              amjad: amounts.amjad - equalShare,
              asim: amounts.asim - equalShare,
              awais: amounts.awais - equalShare,
              hamza: amounts.hamza - equalShare
          }
      };
  }
  
  // Calculate settlements
  function calculateSettlements(balances) {
      const settlements = [];
      const people = Object.keys(balances).map(name => ({ name, balance: balances[name] }));
      
      // Sort people by balance (negative first, then positive)
      people.sort((a, b) => a.balance - b.balance);
      
      let i = 0;
      let j = people.length - 1;
      
      while (i < j) {
          const debtor = people[i];
          const creditor = people[j];
          
          // If both balances are zero, we're done
          if (Math.abs(debtor.balance) < 0.01 && Math.abs(creditor.balance) < 0.01) {
              break;
          }
          
          const amount = Math.min(-debtor.balance, creditor.balance);
          
          if (amount > 0.01) { // Only create settlement if amount is significant
              settlements.push({
                  from: debtor.name,
                  to: creditor.name,
                  amount: Math.round(amount * 100) / 100 // Round to 2 decimal places
              });
              
              debtor.balance += amount;
              creditor.balance -= amount;
          }
          
          if (debtor.balance > -0.01) i++;
          if (creditor.balance < 0.01) j--;
      }
      
      return settlements;
  }
  
  // Update the display with current amounts and histories
  function updateDisplay() {
      // Calculate equal share and balances
      const { total, equalShare, balances } = calculateEqualShare();
      
      // Update individual amounts
      document.getElementById('amjad-amount').textContent = `Rs ${amounts.amjad}`;
      document.getElementById('asim-amount').textContent = `Rs ${amounts.asim}`;
      document.getElementById('awais-amount').textContent = `Rs ${amounts.awais}`;
      document.getElementById('hamza-amount').textContent = `Rs ${amounts.hamza}`;
      
      // Update equal share displays
      document.getElementById('amjad-equal-share').textContent = `Equal Share: Rs ${equalShare.toFixed(2)}`;
      document.getElementById('asim-equal-share').textContent = `Equal Share: Rs ${equalShare.toFixed(2)}`;
      document.getElementById('awais-equal-share').textContent = `Equal Share: Rs ${equalShare.toFixed(2)}`;
      document.getElementById('hamza-equal-share').textContent = `Equal Share: Rs ${equalShare.toFixed(2)}`;
      
      // Update balance displays with color coding
      updateBalanceDisplay('amjad', balances.amjad);
      updateBalanceDisplay('asim', balances.asim);
      updateBalanceDisplay('awais', balances.awais);
      updateBalanceDisplay('hamza', balances.hamza);
      
      // Update total amount
      document.getElementById('total-amount').textContent = `Rs ${total}`;
      document.getElementById('equal-share-total').textContent = `Equal Share Per Person: Rs ${equalShare.toFixed(2)}`;
      
      // Update histories
      updateHistory('amjad');
      updateHistory('asim');
      updateHistory('awais');
      updateHistory('hamza');
      
      // Update settlement information
      updateSettlementInfo(balances);
  }
  
  // Update balance display with appropriate color
  function updateBalanceDisplay(member, balance) {
      const balanceElement = document.getElementById(`${member}-balance`);
      balanceElement.textContent = `Balance: Rs ${balance.toFixed(2)}`;
      
      if (balance > 0) {
          balanceElement.className = 'balance-display positive-balance';
      } else if (balance < 0) {
          balanceElement.className = 'balance-display negative-balance';
      } else {
          balanceElement.className = 'balance-display';
      }
  }
  
  // Update settlement information
  function updateSettlementInfo(balances) {
      const settlementList = document.getElementById('settlement-list');
      const settlementInfo = document.getElementById('settlement-info');
      settlementList.innerHTML = '';
      
      const settlements = calculateSettlements(balances);
      
      if (settlements.length === 0) {
          settlementInfo.textContent = 'No settlements needed - everyone has paid their equal share!';
          settlementInfo.style.display = 'block';
          return;
      }
      
      settlementInfo.textContent = 'To balance contributions:';
      settlementInfo.style.display = 'block';
      
      settlements.forEach(settlement => {
          const listItem = document.createElement('li');
          listItem.className = 'settlement-item payment';
          listItem.textContent = `${settlement.from.charAt(0).toUpperCase() + settlement.from.slice(1)} should pay Rs ${settlement.amount.toFixed(2)} to ${settlement.to.charAt(0).toUpperCase() + settlement.to.slice(1)}`;
          settlementList.appendChild(listItem);
      });
  }
  
  // Update history display for a member
  function updateHistory(member) {
      const historyElement = document.getElementById(`${member}-history`);
      historyElement.innerHTML = '';
      
      if (histories[member].length === 0) {
          historyElement.innerHTML = '<div class="history-item">No contributions yet</div>';
          return;
      }
      
      // Show only the last 5 entries (most recent first)
      const recentHistory = [...histories[member]].reverse().slice(0, 5);
      
      recentHistory.forEach(entry => {
          const item = document.createElement('div');
          item.className = 'history-item';
          item.textContent = `Rs ${entry.amount} - ${entry.timestamp} (by ${entry.addedBy})`;
          historyElement.appendChild(item);
      });
  }
  
  // Allow Enter key to add amount
  document.addEventListener('DOMContentLoaded', function() {
      // Check login status on page load
      checkLoginStatus();
      
      // Add event listeners for Enter key
      const inputs = document.querySelectorAll('.amount-input');
      inputs.forEach(input => {
          input.addEventListener('keypress', function(e) {
              if (e.key === 'Enter') {
                  const member = this.id.split('-')[0];
                  addAmount(member);
              }
          });
      });
  });
