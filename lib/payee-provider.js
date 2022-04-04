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
  selector: '.source.ledger .string.payee',
  inclusionPriority: 2,
  suggestionPriority: 1,

  getSuggestions({editor, prefix, bufferPosition}) {
    const payees = this.getPayeeNames(editor);
    // prefix = this.getPrefix(editor, bufferPosition);
    const prefix_low = prefix.toLowerCase();

    return payees
        .filter(a => a.toLowerCase().indexOf(prefix_low) >= 0)
        .map(a => ({type: 'payee', text: a, replacementPrefix: prefix}));
  },

  // getPrefix(editor, bufferPosition) {
  //   const line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
  //   return line.trim();
  // },

  getPayeeNames(editor) {
    if (editor.ledgerPayeesList != null) {
      return editor.ledgerPayeesList;
    }

    // FIXME stub in my fixtures for now
    return editor.ledgerPayeesList = this.payees;

    // return this.loadAccounts(editor);
  },

  dispose() {
    return this.disposable.dispose();
  },

  loadAccounts(editor) {
    if (this.disposable == null) {
      this.disposable = editor.onDidSave(event => {
        return editor.ledgerPayeesList = undefined;
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
          editor.ledgerPayeesList = result.split("\n");
          return resolve(editor.ledgerPayeesList);
        }
      });
      return proc.stdin.end(pythonScript);
    });
  },

  payees: [
      'AZS Brusher Equip',
      'Adaptive Seeds',
      'Advance Auto Parts',
      'Ag Matters LLC',
      'Amazon.com',
      'Aubuchon',
      'Backblaze',
      'Bangor FM',
      'Bangor Payroll',
      'Bank of America',
      'BioWorks',
      'Biobest',
      'Blue Seal Feeds',
      'CMP',
      'Carquest',
      'Charlie Lazaroff',
      'Citibank',
      'Clayton',
      'Countryway Insurance',
      'Crescent Lumber',
      'Cutler Embroidery',
      'Debbie Carter',
      'Dec phone',
      'Dennis Paper',
      'Deposit',
      'Drost Auto',
      'Evernote',
      'Farm Service Agency',
      'Farm Share: L Williams',
      'Farm Shareholder',
      'Farmall Parts.com',
      'Farmtek',
      'Fedco',
      'GIC',
      'Galen Hopkins',
      'Gandi',
      'Gas Station',
      'General Journal',
      'Global Industrial',
      'Greenhouse Supply',
      'Griffin Greenhouse Supply',
      'Growing for Market',
      'H20 Well Drilling',
      'HOI',
      'Hammond Lumber',
      'Harbor Freight',
      'High Mowing Seeds',
      'Home Depot',
      'Ingraham Equipment',
      'Interest',
      'Janet Roderick',
      'Jason Glick',
      'Johnny\'s',
      'Kitazawa Seed Company',
      'LivingDot',
      'Lowes',
      'MFFM',
      'MISSED A CK IN DEP THIS AM|Check Received 5.00',
      'MOFGA',
      'Maine Potato Lady',
      'Maine Soil Testing Service',
      'Maine Trailer',
      'MaineOxy',
      'Market Farm Implement',
      'McKee Energy',
      'Monnit',
      'NH Bragg',
      'NLC',
      'NRS',
      'Nexmo',
      'Nolt\'s Produce Supply',
      'Northeast Ag',
      'OESCO',
      'Orcutt\'s',
      'Orono FM',
      'Other',
      'Paris Farmers Union',
      'Praxis Welding',
      'RH Foster',
      'Renys',
      'SVFCU',
      'Seacoast Scaffold',
      'Service Charge',
      'Snowman Group',
      'Square Deposit',
      'State Farm',
      'State of Maine',
      'Steele Plant Farm',
      'Store It Cold',
      'Stratham Tire',
      'Sullivan\'s Waste',
      'TDS',
      'Totally Tomatoes',
      'Town of Etna',
      'Tractor Supply Company',
      'Trailside Discount',
      'Transfer',
      'UMaine Analytical Lab',
      'US Cellular',
      'USPS',
      'Undercover',
      'Viking Lumber',
      'Vultr.com',
      'Waterville FM',
      'Wild Boar Farm',
      'Winterport Boot',
  ]
};
