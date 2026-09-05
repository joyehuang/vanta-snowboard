// Run in the CUA browser REPL with a supported tab handle.
// This checks actual rendered geometry, not the presence of CSS declarations.
export async function verifyKitSwitch(tab) {
 const control=tab.playwright.getByRole('switch',{name:'Include matching goggles'});
 const checks=[];
 for(let i=0;i<5;i++){
  if(i)await control.click();
  const result=await control.evaluate(el=>{
   const track=el.getBoundingClientRect();
   const thumb=el.querySelector('[data-slot="switch-thumb"]').getBoundingClientRect();
   return {checked:el.getAttribute('aria-checked'),leftInset:thumb.left-track.left,rightInset:track.right-thumb.right,pass:thumb.left>=track.left&&thumb.right<=track.right&&thumb.top>=track.top&&thumb.bottom<=track.bottom};
  });
  checks.push(result);
  if(!result.pass)throw new Error(`Switch thumb escaped track: ${JSON.stringify(result)}`);
 }
 return checks;
}
