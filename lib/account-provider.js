/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { execFile } = require('child_process');

module.exports = {
  selector: '.source.ledger .string.account',
  inclusionPriority: 2,
  suggestionPriority: 1,

  getSuggestions({editor, prefix, bufferPosition}) {
    const accounts = this.getAccountNames(editor);
    prefix = this.getPrefix(editor, bufferPosition);
    const prefix_low = prefix.toLowerCase();

    return accounts
        .filter(a => a.toLowerCase().indexOf(prefix_low) >= 0)
        .map(a => ({type: 'account', text: a, replacementPrefix: prefix}));
  },

  getPrefix(editor, bufferPosition) {
    const line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
    return line.trim();
  },

  getAccountNames(editor) {
    if (editor.ledgerAccountsList != null) {
      return editor.ledgerAccountsList;
    }

    // FIXME stub in my fixtures for now
    return editor.ledgerAccountsList = this.accounts;

    // return this.loadAccounts(editor);
  },

  dispose() {
    return this.disposable.dispose();
  },

  loadAccounts(editor) {
    if (this.disposable == null) {
      this.disposable = editor.onDidSave(event => {
        return editor.ledgerAccountsList = undefined;
      });
    }
    const escapedPath = editor.getPath().split("'''").join("\\'\\'\\'");
    const pythonScript = `\
import ledger
def print_recursive(accounts):
  for a in accounts:
    print a.fullname()
    print_recursive(a.accounts())

print_recursive(ledger.read_journal('''${escapedPath}''').master.accounts())\
`;
    const ledgerBinary = atom.config.get('language-ledger.ledgerBinary');
    return new Promise(function(resolve, reject) {
      const proc = execFile(ledgerBinary, ["python"], {windowsHide: true}, (err, result, stderr) => {
        if (err != null) {
          console.log(err);
          return reject([]);
        } else {
          editor.ledgerAccountsList = result.split("\n");
          return resolve(editor.ledgerAccountsList);
        }
      });
      return proc.stdin.end(pythonScript);
    });
  },

  accounts: [
    'Checking',
    'Assets:SVFCU:Checking',
    'Mortgage',
    'Assets:SVFCU:Mortgage',
    'Assets:SVFCU:Savings',
    'Assets:Undeposited Funds',
    'Barn Loan - Parents',
    'Education',
    'Equity:Owners Draw',
    'Equity:zOwners Equity Investment',
    'Expenses:Bank & Merchant Fees',
    'Expenses:Dues and Subscriptions',
    'Expenses:Field Supplies',
    'Expenses:Fuel',
    'Expenses:Greenhouse Hardware',
    'Expenses:Greenhouse Supplies',
    'Expenses:Hardware and Shop Supplies',
    'Expenses:Harvest & Post Harvest Supplies',
    'Expenses:Insurance',
    'Expenses:Irrigation',
    'Expenses:Livestock',
    'Expenses:Loan Interest',
    'Expenses:Office Supplies',
    'Expenses:Other Farm Activities',
    'Expenses:Payroll',
    'Expenses:Pest Controls',
    'Expenses:Professional Services',
    'Expenses:Property Tax',
    'Expenses:Repairs & Maintenance',
    'Expenses:Seeds & Plants',
    'Expenses:Soil Fertility & Amendments',
    'Expenses:Utilities',
    'Expenses:Vehicles',
    'FSA Loan:Barn Mortgage',
    'FSA Loan:Mortgage',
    'FSA Loan:Term Loan',
    'Farm Buildings',
    'Farm Buildings:Barn',
    'Farm Equipment',
    'Farm Shareholder',
    'Farmers Market Supplies',
    'General Farm Income',
    'Income:Farm Share Bonuses',
    'Income:Grant Income',
    'Income:Interest Income',
    'Income:Over/Under',
    'Income:Other',
    'Income:Other:Bags',
    'Income:Produce:Beet Greens',
    'Income:Produce:Beets',
    'Income:Produce:Beets:Bunched',
    'Income:Produce:Broccoli',
    'Income:Produce:Cabbage',
    'Income:Produce:Carrots',
    'Income:Produce:Carrots:Bags',
    'Income:Produce:Cauliflower',
    'Income:Produce:Celeriac',
    'Income:Produce:Cucumbers',
    'Income:Produce:Eggplant',
    'Income:Produce:Fennel',
    'Income:Produce:Garlic',
    'Income:Produce:Garlic:Scapes',
    'Income:Produce:Herbs',
    'Income:Produce:Herbs:Basil',
    'Income:Produce:Leeks',
    'Income:Produce:Onions',
    'Income:Produce:Onions:Bags',
    'Income:Produce:Peppers, Hot',
    'Income:Produce:Peppers',
    'Income:Produce:Potatoes',
    'Income:Produce:Radish:Storage',
    'Income:Produce:Sweet Potatoes',
    'Income:Produce:Tomatoes',
    'Income:Produce:Tomatoes:Cherry',
    'Liabilities:Citi',
    'Liabilities:Farm Shares Payable',
    'Liabilities:Tractor Loan',
    'Other Expense',
    'Petty Cash',
    'Retained Earnings',
    'Synchrony HYS',
    'Tools & Small Equipment',
    'Vendor Discounts',
  ],
};
